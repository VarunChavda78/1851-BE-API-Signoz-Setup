import { Controller, Get, Query, Logger } from '@nestjs/common';
import { GACredentialsRepository } from './ga-credentials.repository';

@Controller({
  version: '1',
  path: 'landing-analytics/status',
})
export class LandingAnalyticsStatusController {
  private readonly logger = new Logger(LandingAnalyticsStatusController.name);
  
  constructor(private gaCredentialsRepository: GACredentialsRepository) {}

  @Get()
  async getConnectionStatus(@Query('brandId') brandId: number) {
    try {
      const credentials = await this.gaCredentialsRepository.findByBrandId(brandId);
      
      return {
        connected: credentials.length > 0,
        hasPropertyId: credentials.length > 0 && credentials[0].propertyId ? true : false,
        credentialId: credentials.length > 0 ? credentials[0].id : null
      };
    } catch (error) {
      this.logger.error(`Error checking connection status for brand ${brandId}`, error);
      return { connected: false, error: 'Failed to check connection status' };
    }
  }
}
