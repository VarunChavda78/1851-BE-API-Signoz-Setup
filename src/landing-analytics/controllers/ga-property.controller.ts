import { Controller, Put, Body, Param, Logger, Get, Query, Post } from '@nestjs/common';
import { GACredentialsRepository } from '../repositories/ga-credentials.repository';
import { GoogleOAuthService } from '../services/google-oauth.service';
import { google } from 'googleapis';


@Controller({
  version: '1',
  path: 'landing-analytics/property',
})
export class GAPropertyController {
  private readonly logger = new Logger(GAPropertyController.name);
  
  constructor(private gaCredentialsRepository: GACredentialsRepository, private googleOAuthService: GoogleOAuthService) {}

  @Put(':id')
  async updatePropertyId(
    @Param('id') id: number,
    @Body() body: { propertyId: string }
  ) {
    try {
      const credential = await this.gaCredentialsRepository.findOne(id);
      if (!credential) {
        return { success: false, message: 'Credential not found' };
      }
      
      credential.propertyId = body.propertyId;
      await this.gaCredentialsRepository.save(credential);
      
      return { success: true, message: 'Property ID updated successfully' };
    } catch (error) {
      this.logger.error(`Error updating property ID for credential ${id}`, error);
      return { success: false, message: 'Failed to update property ID', error: error.message };
    }
  }

  @Get('list')
  async listProperties(@Query('brandId') brandId: number) {
    try {
      const credentials = await this.gaCredentialsRepository.findByBrandId(brandId);
      
      if (!credentials.length) {
        return { success: false, message: 'No Google Analytics connection found' };
      }
      
      const credential = credentials[0];
      
      // Check if token needs refresh
      if (new Date(credential.expiresAt) <= new Date()) {
        const refreshed = await this.googleOAuthService.refreshToken(credential.id);
        if (!refreshed) {
          return { success: false, message: 'Failed to refresh access token' };
        }
        // Get updated credential
        const updatedCredential = await this.gaCredentialsRepository.findOne(credential.id);
        if (!updatedCredential) {
          return { success: false, message: 'Failed to get updated credential' };
        }
        credential.accessToken = updatedCredential.accessToken;
      }
      
      // Use the googleapis library
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: credential.accessToken
      });

      const analyticAdmin = google.analyticsadmin({
        version: 'v1beta',
        auth: oauth2Client
      });
      
      // List available properties
      const propertiesResponse = await analyticAdmin.properties.list();
      
      return {
        success: true,
        properties: propertiesResponse.data.properties?.map(p => ({
          name: p.name,
          displayName: p.displayName,
          propertyId: p.name.split('/')[1], // Extract numeric ID
          createTime: p.createTime,
          updateTime: p.updateTime,
          parent: p.parent,
          timeZone: p.timeZone
        })) || []
      };
    } catch (error) {
      this.logger.error(`Error listing properties for brand ${brandId}`, error);
      return { success: false, message: 'Failed to list properties', error: error.message };
    }
  }

  @Post('reconnect')
async forceReconnect(@Body() body: { brandId: number }) {
  try {
    const { brandId } = body;
    
    // Find all credentials for this brand
    const credentials = await this.gaCredentialsRepository.findByBrandId(brandId);
    
    // Mark all as inactive
    for (const credential of credentials) {
      credential.isActive = false;
      await this.gaCredentialsRepository.save(credential);
    }
    
    return { 
      success: true, 
      message: 'Google Analytics credentials deactivated. Please reconnect your account.' 
    };
  } catch (error) {
    this.logger.error(`Error forcing reconnection for brand ${body.brandId}:`, error.message);
    return { success: false, message: 'Failed to process reconnection request' };
  }
}


}