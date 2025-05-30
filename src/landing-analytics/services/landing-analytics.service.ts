// src/landing-analytics/services/landing-analytics.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';
import { Not, IsNull } from 'typeorm';
import * as dayjs from 'dayjs'
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

  @Cron('0 1 * * *') // Run daily at 1 AM
  async dailySyncAllLandingPages() {
    this.logger.log('Starting daily Google Analytics sync for all landing pages');
    
    try {
      // Get all active credentials with property IDs
      const credentials = await this.gaCredentialsRepository.findActiveWithPropertyId();
      this.logger.log(`Found ${credentials.length} landing pages with GA credentials`);
      
      // Process in batches to avoid overloading
      for (let i = 0; i < credentials.length; i++) {
        const credential = credentials[i];
        try {
          await this.fetchAndStoreLandingPageData(credential);
          
          // Add small delay between requests to avoid rate limiting
          if (i < credentials.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          this.logger.error(`Error processing credential ${credential.id}:`, error.message);
        }
      }
      
      this.logger.log('Completed daily Google Analytics sync');
    } catch (error) {
      this.logger.error('Error in daily Google Analytics sync:', error.message);
    }
  }

  async fetchAndStoreLandingPageData(
    credential,
    query: { startDate?: string; endDate?: string } = {}
  ) {
    try {
      // Refresh token if needed
      if (new Date(credential.expiresAt) <= new Date()) {
        this.logger.log(`Token for credential ${credential.id} has expired, attempting to refresh`);
        const refreshed = await this.googleOAuthService.refreshToken(credential.id);
        
        if (!refreshed) {
          // Handle refresh failure - prompt user to reconnect
          await this.lpGaSyncStatusRepository.updateSyncStatus(
            credential.brandId,
            credential.landingPage?.id,
            'auth_expired: Authentication expired, please reconnect your Google Analytics account'
          );
          
          this.logger.warn(`Token refresh failed for credential ${credential.id}, user needs to reconnect`);
          
          return {
            success: false,
            message: 'Authentication expired. Please reconnect your Google Analytics account.',
            errorCode: 'AUTH_EXPIRED'
          };
        }
        
        // Get updated credential
        const updatedCredential = await this.gaCredentialsRepository.findOne(credential.id);
        credential = updatedCredential;
      }
      
      // Set up date range
      const startDate = query.startDate 
        ? dayjs(query.startDate).format('YYYY-MM-DD')
        : dayjs().subtract(7, 'day').format('YYYY-MM-DD');
      
      const endDate = query.endDate
        ? dayjs(query.endDate).format('YYYY-MM-DD')
        : dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      
      this.logger.log(`Fetching GA data for brand ${credential.brandId}, dates: ${startDate} to ${endDate}`);
      
      // Set up OAuth client
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: credential.accessToken
      });
      
      // Create Analytics Data API client
      const analyticsDataClient = google.analyticsdata({
        version: 'v1beta',
        auth: oauth2Client
      });
      
      // Fetch analytics data using the REST client
      const data = await this.runGAReportWithRest(
        analyticsDataClient,
        credential.propertyId,
        startDate,
        endDate
      );
      
      // Clear existing data for this date range
      await this.lpGaSummaryRepository.deleteByDateRange(
        startDate,
        endDate,
        credential.brandId,
        credential.landingPage?.id
      );
      
      // Store fetched data
      for (const item of data) {
        await this.lpGaSummaryRepository.save({
          ...item,
          brandId: credential.brandId,
          landingPage: credential.landingPage,
        });
      }
      
      // Update sync status
      await this.lpGaSyncStatusRepository.updateSyncStatus(
        credential.brandId,
        credential.landingPage?.id,
        'success'
      );
      
      this.logger.log(
        `Saved Google Analytics Data for brand ${credential.brandId}, landing page ${credential.landingPage?.id || 'N/A'}`
      );
      
      return {
        success: true,
        message: 'Data fetched and stored successfully',
        dateRange: `${startDate} - ${endDate}`,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching data for brand ${credential.brandId}, landing page ${credential.landingPage?.id || 'N/A'}:`,
        error.message
      );
      
      // Update sync status with error
      await this.lpGaSyncStatusRepository.updateSyncStatus(
        credential.brandId,
        credential.landingPage?.id,
        `error: ${error.message}`
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
    endDate: string
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
        dimensions: [
          { name: 'date' },
        ],
      }
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
        syncStatus = await this.lpGaSyncStatusRepository.findByBrandAndPage(brandId, landingPageId);
      } else {
        syncStatus = await this.lpGaSyncStatusRepository.findByBrandId(brandId);
      }
      
      return {
        success: true,
        lastSynced: syncStatus?.lastSynced || null,
        status: syncStatus?.lastSyncStatus || 'never',
      };
    } catch (error) {
      this.logger.error(`Error getting sync status for brand ${brandId}:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getAnalyticsData(brandId: number, startDate: string, endDate: string, landingPageId?: number) {
    try {
      let data;
      
      if (landingPageId) {
        data = await this.lpGaSummaryRepository.findByLandingPageId(
          landingPageId,
          startDate,
          endDate
        );
      } else {
        data = await this.lpGaSummaryRepository.findByBrandId(
          brandId,
          startDate,
          endDate
        );
      }
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      this.logger.error(`Error getting analytics data for brand ${brandId}:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async triggerManualSync(brandId: number, landingPageId?: number) {
    try {
      // Find credentials
      let credentials;
      
      if (landingPageId) {
        const credential = await this.gaCredentialsRepository.findByLandingPageId(landingPageId);
        credentials = credential ? [credential] : [];
      } else {
        credentials = await this.gaCredentialsRepository.findByBrandId(brandId);
      }
      
      if (!credentials || credentials.length === 0) {
        return {
          success: false,
          message: 'No Google Analytics credentials found',
        };
      }
      
      // Process each credential (usually just one)
      const results = [];
      
      for (const credential of credentials) {
        if (!credential.propertyId) {
          results.push({
            credentialId: credential.id,
            success: false,
            message: 'Missing property ID',
          });
          continue;
        }
        
        const result = await this.fetchAndStoreLandingPageData(credential);
        results.push({
          credentialId: credential.id,
          ...result,
        });
      }
      
      // Determine overall success
      const allSuccessful = results.every(r => r.success);
      
      return {
        success: allSuccessful,
        message: allSuccessful ? 'Data synchronized successfully' : 'Some synchronization tasks failed',
        details: results,
      };
    } catch (error) {
      this.logger.error(`Error triggering manual sync for brand ${brandId}:`, error.message);
      return {
        success: false,
        message: 'Failed to synchronize data',
        error: error.message,
      };
    }
  }
}
