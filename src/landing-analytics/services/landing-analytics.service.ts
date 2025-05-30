import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { google } from 'googleapis';
import * as dayjs from 'dayjs';
import { GACredentialsRepository } from '../repositories/ga-credentials.repository';
import { GoogleOAuthService } from './google-oauth.service';
import { LpGaSummaryRepository } from '../repositories/lp-ga-summary.repository';
import { LpGaSyncStatusRepository } from '../repositories/lp-ga-sync-status.repository';

@Injectable()
export class LandingAnalyticsService {
  private readonly logger = new Logger(LandingAnalyticsService.name);

  constructor(
    private gaCredentialsRepository: GACredentialsRepository,
    private googleOAuthService: GoogleOAuthService,
    private lpGaSummaryRepository: LpGaSummaryRepository,
    private lpGaSyncStatusRepository: LpGaSyncStatusRepository,
  ) {}

  @Cron('0 1 * * *') // Daily at 1 AM
  async dailySyncAllLandingPages() {
    const credentials =
      await this.gaCredentialsRepository.findActiveWithPropertyId();

    for (const credential of credentials) {
      try {
        await this.fetchAndStoreLandingPageData(credential);
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
        throw new Error('Invalid credential data - missing brandId or propertyId');
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

        // Get updated credential
        const updatedCredential = await this.gaCredentialsRepository.findOne(
          credential.id,
        );
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
        `Fetching GA data for brand ${credential.brandId}, dates: ${startDate} to ${endDate}`,
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
        'success'
      );

      this.logger.log(
        `Saved Google Analytics Data for brand ${
          credential.brandId
        }, landing page ${credential.landingPage?.id || 'N/A'}`,
      );

      return {
        success: true,
        message: 'Data fetched and stored successfully',
        dateRange: `${startDate} - ${endDate}`,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching data for brand ${credential.brandId}, landing page ${
          credential.landingPage?.id || 'N/A'
        }:`,
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
        message: 'Failed to fetch and store data',
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

  async triggerManualSync(brandId: number, landingPageId?: number) {
    try {
      // Validate IDs - landingPageId is now required
      if (!brandId || !landingPageId) {
        throw new Error('Both Brand ID and Landing Page ID are required');
      }
  
      console.log('Fetching credentials for:', { brandId, landingPageId });
      
      // Only look for landing-page-specific credentials
      const credentials = await this.gaCredentialsRepository.findByLandingPageId(landingPageId);
      console.log('Found credentials:', credentials);
  
      if (!credentials.length) {
        return {
          success: false,
          message: 'No GA connection found for this landing page',
        };
      }
  
      // Process sync for each credential (should typically be just one)
      const results = await Promise.all(
        credentials.map(async (credential) => {
          try {
            console.log('Processing credential:', credential.id);
            
            // Validate credential data
            if (!credential.propertyId) {
              throw new Error('Missing propertyId in GA connection');
            }
            if (!credential.isActive) {
              throw new Error('GA connection is not active');
            }
  
            const result = await this.fetchAndStoreLandingPageData({
              ...credential,
              brandId: credential.brandId // Ensure brandId is from credential
            });
  
            return {
              credentialId: credential.id,
              ...result,
            };
          } catch (error) {
            this.logger.error(`Sync failed for credential ${credential.id}`, error);
            return {
              credentialId: credential.id,
              success: false,
              message: error.message,
            };
          }
        })
      );
  
      return {
        success: results.every(r => r.success),
        message: results.every(r => r.success)
          ? 'Data synchronized successfully'
          : results[0].message, // Return first error if any
        details: results,
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
