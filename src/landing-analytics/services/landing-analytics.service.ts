// src/landing-analytics/services/landing-analytics.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { google } from 'googleapis';
import * as dayjs from 'dayjs';
import { GACredentialsRepository } from '../repositories/ga-credentials.repository';
import { GoogleOAuthService } from './google-oauth.service';
import { LpGaSummaryRepository } from '../repositories/lp-ga-summary.repository';
import { LpGaSyncStatusRepository } from '../repositories/lp-ga-sync-status.repository';
import { LpGaLocationMetricsRepository } from '../repositories/lp-ga-location-metrics.repository';
import { LocationService } from 'src/mysqldb/location.service';

@Injectable()
export class LandingAnalyticsService {
  private readonly logger = new Logger(LandingAnalyticsService.name);

  constructor(
    private gaCredentialsRepository: GACredentialsRepository,
    private googleOAuthService: GoogleOAuthService,
    private lpGaSummaryRepository: LpGaSummaryRepository,
    private lpGaSyncStatusRepository: LpGaSyncStatusRepository,
    private lpGaLocationMetricsRepository: LpGaLocationMetricsRepository,
    private locationService: LocationService,
  ) {}

  @Cron('0 1 * * *') // Daily at 1 AM
  async dailySyncAllLandingPages() {
    const credentials =
      await this.gaCredentialsRepository.findActiveWithPropertyId();

    for (const credential of credentials) {
      try {
        // Fetch and store summary data
        await this.fetchAndStoreLandingPageData(credential);

        // Fetch and store location data
        await this.fetchAndStoreLocationData(credential);
      } catch (error) {
        this.logger.error(
          `Sync failed for credential ${credential.id}:`,
          error,
        );
      }
    }
  }

  async fetchAndStoreLandingPageData(
    credential,
    query: { startDate?: string; endDate?: string } = {},
  ) {
    try {
      if (!credential.brandId || !credential.propertyId) {
        throw new Error(
          'Invalid credential data - missing brandId or propertyId',
        );
      }
      // Refresh token if needed
      if (new Date(credential.expiresAt) <= new Date()) {
        this.logger.log(
          `Token for credential ${credential.id} has expired, attempting to refresh`,
        );
        const refreshed = await this.googleOAuthService.refreshToken(
          credential.id,
        );

        if (!refreshed) {
          // Handle refresh failure - prompt user to reconnect
          await this.lpGaSyncStatusRepository.updateSyncStatus(
            credential.brandId,
            credential.landingPage?.id,
            'auth_expired: Authentication expired, please reconnect your Google Analytics account',
          );

          this.logger.warn(
            `Token refresh failed for credential ${credential.id}, user needs to reconnect`,
          );

          return {
            success: false,
            message:
              'Authentication expired. Please reconnect your Google Analytics account.',
            errorCode: 'AUTH_EXPIRED',
          };
        }

        // Get updated credential with new token
        const updatedCredential = await this.gaCredentialsRepository.findOneById(
          credential.id,
        );
        if (!updatedCredential || !updatedCredential.isActive) {
          return {
            success: false,
            message: 'Failed to refresh authentication. Please reconnect your Google Analytics account.',
            errorCode: 'AUTH_EXPIRED',
          };
        }
        credential = updatedCredential;
      }

      // Set up date range
      const startDate = query.startDate
        ? dayjs(query.startDate).format('YYYY-MM-DD')
        : dayjs().subtract(7, 'day').format('YYYY-MM-DD');

      const endDate = query.endDate
        ? dayjs(query.endDate).format('YYYY-MM-DD')
        : dayjs().subtract(1, 'day').format('YYYY-MM-DD');

      this.logger.log(
        `Fetching GA summary data for brand ${credential.brandId}, dates: ${startDate} to ${endDate}`,
      );

      // Set up OAuth client
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: credential.accessToken,
      });

      // Create Analytics Data API client
      const analyticsDataClient = google.analyticsdata({
        version: 'v1beta',
        auth: oauth2Client,
      });

      // Fetch analytics data using the REST client
      const data = await this.runGAReportWithRest(
        analyticsDataClient,
        credential.propertyId,
        startDate,
        endDate,
      );

      const landingPageId = credential.landingPage?.id;

      // Clear existing data for this page (or brand if no page)
      await this.lpGaSummaryRepository.deleteByDateRange(
        startDate,
        endDate,
        credential.brandId,
        landingPageId,
      );

      // Store new data
      for (const item of data) {
        await this.lpGaSummaryRepository.save({
          ...item,
          brandId: credential.brandId,
          landingPage: credential.landingPage,
        });
      }

      // Update sync status
      await this.lpGaSyncStatusRepository.updateSyncStatus(
        credential.brandId, // Ensure this is always passed
        credential.landingPage?.id,
        'success',
      );

      this.logger.log(
        `Saved Google Analytics Summary Data for brand ${
          credential.brandId
        }, landing page ${credential.landingPage?.id || 'N/A'}`,
      );

      return {
        success: true,
        message: 'Summary data fetched and stored successfully',
        dateRange: `${startDate} - ${endDate}`,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching summary data for brand ${
          credential.brandId
        }, landing page ${credential.landingPage?.id || 'N/A'}:`,
        error.message,
      );

      // Update sync status with error
      await this.lpGaSyncStatusRepository.updateSyncStatus(
        credential.brandId,
        credential.landingPage?.id,
        `error: ${error.message}`,
      );

      return {
        success: false,
        message: 'Failed to fetch and store summary data',
        error: error.message,
      };
    }
  }

  private async runGAReportWithRest(
    analyticsDataClient: any,
    propertyId: string,
    startDate: string,
    endDate: string,
  ) {
    // For GA4, property IDs sometimes include "properties/" prefix
    // Make sure it's properly formatted
    const formattedPropertyId = propertyId.includes('properties/')
      ? propertyId.replace('properties/', '')
      : propertyId;

    const response = await analyticsDataClient.properties.runReport({
      property: `properties/${formattedPropertyId}`,
      requestBody: {
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'userEngagementDuration' },
          { name: 'averageSessionDuration' },
          { name: 'activeUsers' },
          { name: 'bounceRate' },
        ],
        dimensions: [{ name: 'date' }],
      },
    });

    return this.processGAResponse(response.data);
  }

  private processGAResponse(response) {
    const result = [];

    if (!response.rows || response.rows.length === 0) {
      return result;
    }

    for (const row of response.rows) {
      const inputDate = row.dimensionValues[0].value;
      const formattedDate = dayjs(inputDate, 'YYYYMMDD').format('YYYY-MM-DD');

      result.push({
        date: formattedDate,
        pageViews: parseInt(row.metricValues[0].value || '0'),
        sessions: parseInt(row.metricValues[1].value || '0'),
        sessionDuration: parseInt(row.metricValues[2].value || '0'),
        avgSessionDuration: parseFloat(row.metricValues[3].value || '0'),
        users: parseInt(row.metricValues[4].value || '0'),
        bounceRate: parseFloat(row.metricValues[5].value || '0'),
      });
    }

    return result;
  }

  // New method to fetch and store location data
  async fetchAndStoreLocationData(
    credential,
    query: { startDate?: string; endDate?: string } = {},
  ) {
    try {
      if (!credential.brandId || !credential.propertyId) {
        throw new Error(
          'Invalid credential data - missing brandId or propertyId',
        );
      }

      // Refresh token if needed
      if (new Date(credential.expiresAt) <= new Date()) {
        this.logger.log(
          `Token for credential ${credential.id} has expired, attempting to refresh`,
        );
        const refreshed = await this.googleOAuthService.refreshToken(
          credential.id,
        );

        if (!refreshed) {
          return {
            success: false,
            message: 'Authentication expired. Please reconnect your Google Analytics account.',
            errorCode: 'AUTH_EXPIRED',
          };
        }

        // Get updated credential with new token
        const updatedCredential = await this.gaCredentialsRepository.findOneById(
          credential.id,
        );
        if (!updatedCredential || !updatedCredential.isActive) {
          return {
            success: false,
            message: 'Failed to refresh authentication. Please reconnect your Google Analytics account.',
            errorCode: 'AUTH_EXPIRED',
          };
        }
        credential = updatedCredential;
      }

      // Set up date range
      const startDate = query.startDate
        ? dayjs(query.startDate).format('YYYY-MM-DD')
        : dayjs().subtract(7, 'day').format('YYYY-MM-DD');

      const endDate = query.endDate
        ? dayjs(query.endDate).format('YYYY-MM-DD')
        : dayjs().subtract(1, 'day').format('YYYY-MM-DD');

      this.logger.log(
        `Fetching GA location data for brand ${credential.brandId}, dates: ${startDate} to ${endDate}`,
      );

      // Set up OAuth client
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: credential.accessToken,
      });

      // Create Analytics Data API client
      const analyticsDataClient = google.analyticsdata({
        version: 'v1beta',
        auth: oauth2Client,
      });

      // Fetch location data
      const locationData = await this.runGALocationReportWithRest(
        analyticsDataClient,
        credential.propertyId,
        startDate,
        endDate,
      );

      const landingPageId = credential.landingPage?.id;

      // Clear existing location data for this date range
      await this.lpGaLocationMetricsRepository.deleteByDateRange(
        startDate,
        endDate,
        credential.brandId,
        landingPageId,
      );

      // Store new location data
      for (const item of locationData) {
        // Get coordinates if not already available
        if (!item.latitude || !item.longitude) {
          try {
            const coordinates = await this.locationService.getGeocode({
              city: item.city,
              state: item.state,
              country: item.country,
            });

            item.latitude = coordinates.latitude || 0;
            item.longitude = coordinates.longitude || 0;
          } catch (error) {
            this.logger.error(
              `Failed to get coordinates for ${item.city}, ${item.state}, ${item.country}`,
              error.message,
            );
            item.latitude = 0;
            item.longitude = 0;
          }
        }

        await this.lpGaLocationMetricsRepository.save({
          ...item,
          brandId: credential.brandId,
          landingPage: credential.landingPage,
        });
      }

      this.logger.log(
        `Saved Google Analytics Location Data for brand ${
          credential.brandId
        }, landing page ${credential.landingPage?.id || 'N/A'}`,
      );

      return {
        success: true,
        message: 'Location data fetched and stored successfully',
        dateRange: `${startDate} - ${endDate}`,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching location data for brand ${
          credential.brandId
        }, landing page ${credential.landingPage?.id || 'N/A'}:`,
        error.message,
      );

      return {
        success: false,
        message: 'Failed to fetch and store location data',
        error: error.message,
      };
    }
  }

  private async runGALocationReportWithRest(
    analyticsDataClient: any,
    propertyId: string,
    startDate: string,
    endDate: string,
  ) {
    // For GA4, property IDs sometimes include "properties/" prefix
    // Make sure it's properly formatted
    const formattedPropertyId = propertyId.includes('properties/')
      ? propertyId.replace('properties/', '')
      : propertyId;

    const response = await analyticsDataClient.properties.runReport({
      property: `properties/${formattedPropertyId}`,
      requestBody: {
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'userEngagementDuration' },
          { name: 'averageSessionDuration' },
          { name: 'activeUsers' },
        ],
        dimensions: [
          { name: 'city' },
          { name: 'country' },
          { name: 'region' },
          { name: 'date' },
        ],
      },
    });

    return this.processGALocationResponse(response.data);
  }

  private processGALocationResponse(response) {
    const result = [];

    if (!response.rows || response.rows.length === 0) {
      return result;
    }

    for (const row of response.rows) {
      const city = row.dimensionValues[0].value;
      const country = row.dimensionValues[1].value;
      const state = row.dimensionValues[2].value;
      const inputDate = row.dimensionValues[3].value;
      const formattedDate = dayjs(inputDate, 'YYYYMMDD').format('YYYY-MM-DD');

      result.push({
        city: city || '(not set)',
        country: country || '(not set)',
        state: state || '(not set)',
        date: formattedDate,
        pageViews: parseInt(row.metricValues[0].value || '0'),
        sessions: parseInt(row.metricValues[1].value || '0'),
        sessionDuration: parseInt(row.metricValues[2].value || '0'),
        avgSessionDuration: parseFloat(row.metricValues[3].value || '0'),
        users: parseInt(row.metricValues[4].value || '0'),
        latitude: 0, // Will be populated later if needed
        longitude: 0, // Will be populated later if needed
      });
    }

    return result;
  }

  // // Geocoding method to get coordinates for a location
  // private async getGeocode(city: string, state: string, country: string) {
  //   try {
  //     if (city === '(not set)' || !city) {
  //       return { latitude: 0, longitude: 0 };
  //     }

  //     const address = `${city}, ${state || ''}, ${country || ''}`;
  //     // const apiKey = this.env.getGoogleMapApiKey();

  //     // if (!apiKey) {
  //     //   this.logger.warn('Google Maps API key not configured');
  //     //   return { latitude: 0, longitude: 0 };
  //     // }

  //     const encodedAddress = encodeURIComponent(address);
  //     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  //     const response = await lastValueFrom(this.httpService.get(url));

  //     if (response.data && response.data.results && response.data.results.length > 0) {
  //       const location = response.data.results[0].geometry.location;
  //       return {
  //         latitude: location.lat,
  //         longitude: location.lng,
  //       };
  //     }

  //     return { latitude: 0, longitude: 0 };
  //   } catch (error) {
  //     this.logger.error(`Geocoding error for address: ${city}, ${state}, ${country}`, error);
  //     return { latitude: 0, longitude: 0 };
  //   }
  // }

  async getSyncStatus(brandId: number, landingPageId?: number) {
    try {
      let syncStatus;

      if (landingPageId) {
        syncStatus = await this.lpGaSyncStatusRepository.findByBrandAndPage(
          brandId,
          landingPageId,
        );
      } else {
        syncStatus = await this.lpGaSyncStatusRepository.findByBrandId(brandId);
      }

      return {
        success: true,
        lastSynced: syncStatus?.lastSynced || null,
        status: syncStatus?.lastSyncStatus || 'never',
      };
    } catch (error) {
      this.logger.error(
        `Error getting sync status for brand ${brandId}:`,
        error.message,
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getAnalyticsData(
    brandId: number,
    startDate: string,
    endDate: string,
    landingPageId?: number,
  ) {
    try {
      let data;

      if (landingPageId) {
        data = await this.lpGaSummaryRepository.findByLandingPageId(
          landingPageId,
          startDate,
          endDate,
        );
      } else {
        data = await this.lpGaSummaryRepository.findByBrandId(
          brandId,
          startDate,
          endDate,
        );
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      this.logger.error(
        `Error getting analytics data for brand ${brandId}:`,
        error.message,
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // New method to get location data
  async getLocationData(
    brandId: number,
    startDate: string,
    endDate: string,
    landingPageId?: number,
  ) {
    try {
      let data;

      if (landingPageId) {
        data = await this.lpGaLocationMetricsRepository.findByLandingPageId(
          landingPageId,
          startDate,
          endDate,
        );
      } else {
        data = await this.lpGaLocationMetricsRepository.findByBrandId(
          brandId,
          startDate,
          endDate,
        );
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      this.logger.error(
        `Error getting location data for brand ${brandId}:`,
        error.message,
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get heatmap data
  async getHeatmapData(
    brandId: number,
    startDate: string,
    endDate: string,
    landingPageId?: number,
  ) {
    try {
      const data = await this.lpGaLocationMetricsRepository.fetchHeatmapData(
        landingPageId,
        startDate,
        endDate,
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      this.logger.error(
        `Error getting heatmap data for brand ${brandId}:`,
        error.message,
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async triggerManualSync(brandId: number, landingPageId: number) {
    try {
      // Validate IDs
      if (!brandId || !landingPageId) {
        throw new Error('Both Brand ID and Landing Page ID are required');
      }

      // Only look for landing-page-specific credentials
      const credentials =
        await this.gaCredentialsRepository.findByLandingPageId(landingPageId);

      if (!credentials.length) {
        return {
          success: false,
          message:
            'No active Google Analytics connection found for this landing page',
        };
      }

      // Verify credentials have required data
      const validCredentials = credentials.filter(
        (c) => c.brandId && c.propertyId && c.isActive,
      );

      if (!validCredentials.length) {
        return {
          success: false,
          message:
            'No valid GA connections found (missing propertyId or inactive)',
        };
      }

      // Process sync for each credential
      const summaryResults = await Promise.all(
        validCredentials.map(async (credential) => {
          try {
            const result = await this.fetchAndStoreLandingPageData({
              ...credential,
              brandId: credential.brandId, // Ensure brandId comes from credential
            });

            return {
              credentialId: credential.id,
              ...result,
            };
          } catch (error) {
            this.logger.error(
              `Summary sync failed for credential ${credential.id}`,
              error,
            );
            return {
              credentialId: credential.id,
              success: false,
              message: error.message,
            };
          }
        }),
      );

      // Process location sync for each credential
      const locationResults = await Promise.all(
        validCredentials.map(async (credential) => {
          try {
            const result = await this.fetchAndStoreLocationData({
              ...credential,
              brandId: credential.brandId, // Ensure brandId comes from credential
            });

            return {
              credentialId: credential.id,
              ...result,
            };
          } catch (error) {
            this.logger.error(
              `Location sync failed for credential ${credential.id}`,
              error,
            );
            return {
              credentialId: credential.id,
              success: false,
              message: error.message,
            };
          }
        }),
      );

      const allResults = [...summaryResults, ...locationResults];
      const allSuccess = allResults.every((r) => r.success);

      return {
        success: allSuccess,
        message: allSuccess
          ? 'Data synchronized successfully'
          : 'Some sync operations failed, check details',
        summaryResults,
        locationResults,
      };
    } catch (error) {
      this.logger.error('Error in triggerManualSync', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
