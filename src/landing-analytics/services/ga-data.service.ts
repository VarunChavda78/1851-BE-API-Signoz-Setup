import { Injectable, Logger } from '@nestjs/common';
import { GACredentialsRepository } from '../repositories/ga-credentials.repository';
import { GoogleOAuthService } from './google-oauth.service';
import { google } from 'googleapis';

@Injectable()
export class GADataService {
  private readonly logger = new Logger(GADataService.name);

  constructor(
    private gaCredentialsRepository: GACredentialsRepository,
    private googleOAuthService: GoogleOAuthService,
  ) {}

  async getAnalyticsData(brandId: number, startDate: string, endDate: string) {
    try {
      // Get credentials for this brand
      const credentials =
        await this.gaCredentialsRepository.findByBrandId(brandId);

      if (!credentials.length || !credentials[0].propertyId) {
        return {
          success: false,
          message:
            'No Google Analytics connection found or missing property ID',
        };
      }

      const credential = credentials[0];

      // Check if token needs refresh
      if (new Date(credential.expiresAt) <= new Date()) {
        this.logger.log(
          `Token expired for credential ${credential.id}, attempting refresh`,
        );

        const refreshed = await this.googleOAuthService.refreshToken(
          credential.id,
        );
        if (!refreshed) {
          this.logger.error(
            `Token refresh failed for credential ${credential.id}`,
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
        if (!updatedCredential) {
          return {
            success: false,
            message: 'Failed to get updated credential',
          };
        }
        credential.accessToken = updatedCredential.accessToken;

        this.logger.log(
          `Token successfully refreshed for credential ${credential.id}`,
        );
      }

      // Create OAuth client
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: credential.accessToken,
      });

      // Use the analytics data API
      const analyticsData = google.analyticsdata({
        version: 'v1beta',
        auth: oauth2Client,
      });

      // Get the property ID (assuming it's already in the numeric format)
      const propertyId = credential.propertyId;

      // Run report
      const response = await analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [
            {
              startDate,
              endDate,
            },
          ],
          dimensions: [
            {
              name: 'date',
            },
          ],
          metrics: [
            {
              name: 'screenPageViews',
            },
            {
              name: 'activeUsers',
            },
            {
              name: 'sessions',
            },
            {
              name: 'averageSessionDuration',
            },
          ],
        },
      });

      // Process and return data
      return {
        success: true,
        data: this.processReportResponse(response.data),
      };
    } catch (error) {
      this.logger.error(
        `Error getting analytics data for brand ${brandId}`,
        error,
      );
      return {
        success: false,
        message: 'Failed to get analytics data',
        error: error.message,
      };
    }
  }

  private processReportResponse(response: any) {
    const result = [];

    if (!response.rows) {
      return result;
    }

    for (const row of response.rows) {
      const date = row.dimensionValues[0].value;
      const formattedDate = `${date.substring(0, 4)}-${date.substring(
        4,
        6,
      )}-${date.substring(6, 8)}`;

      result.push({
        date: formattedDate,
        pageViews: parseInt(row.metricValues[0].value),
        users: parseInt(row.metricValues[1].value),
        sessions: parseInt(row.metricValues[2].value),
        avgSessionDuration: parseFloat(row.metricValues[3].value),
      });
    }

    return result;
  }
}
