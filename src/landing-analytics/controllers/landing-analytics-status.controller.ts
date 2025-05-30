import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { GACredentialsRepository } from '../repositories/ga-credentials.repository';

@Controller({
  version: '1',
  path: 'landing-analytics/status',
})
export class LandingAnalyticsStatusController {
  constructor(private gaCredentialsRepository: GACredentialsRepository) {}

  @Get()
  async getConnectionStatus(
    @Query('brandId') brandId: number,
    @Query('landingPageId') landingPageId: number,
  ) {
    if (!brandId || !landingPageId) {
      throw new BadRequestException(
        'Both Brand ID and Landing Page ID are required',
      );
    }

    const credentials = await this.gaCredentialsRepository.findByBrandAndPage(
      brandId,
      landingPageId,
    );

    return {
      connected: credentials.length > 0,
      hasPropertyId: credentials.length > 0 && !!credentials[0].propertyId,
      credentialId: credentials[0]?.id || null,
    };
  }
}
