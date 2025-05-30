import { Controller, Get, Query, Redirect, Logger, BadRequestException } from '@nestjs/common';
import { GoogleOAuthService } from '../services/google-oauth.service';
import { GACredentialsRepository } from '../repositories/ga-credentials.repository';
import { EnvironmentConfigService } from 'src/shared/config/environment-config.service';

@Controller({
  version: '1',
  path: 'landing-analytics/auth/google',
})
export class GoogleOAuthController {
  private readonly logger = new Logger(GoogleOAuthController.name);

  constructor(
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly gaCredentialsRepository: GACredentialsRepository,
    private readonly env: EnvironmentConfigService,
  ) {}

  @Get('connect')
  @Redirect()
  connect(
    @Query('brandId') brandId: number,
    @Query('pageId') pageId: number,
  ) {
    if (!brandId || !pageId) {
      throw new BadRequestException('Both Brand ID and Landing Page ID are required');
    }

    const url = this.googleOAuthService.getAuthUrl(brandId, pageId);
    return { url };
  }

  @Get('callback')
  @Redirect()
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
  ) {
    const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
    const { brandId, pageId } = decodedState;

    const redirectUrl = `${this.env.getBrandPortalUrl()}/v2/landing/site-analytics?brandId=${brandId}&pageId=${pageId}`;

    if (error) {
      return {
        url: `${redirectUrl}&connection=error&message=${encodeURIComponent(error)}`,
      };
    }

    const result = await this.googleOAuthService.handleCallback(code, state);
    return {
      url: `${redirectUrl}&connection=${result.success ? 'success' : 'error'}`,
    };
  }

  @Get('reconnect')
  @Redirect()
  async reconnect(
    @Query('brandId') brandId: number,
    @Query('pageId') pageId: number,
  ) {
    if (!brandId || !pageId) {
      throw new BadRequestException('Both Brand ID and Landing Page ID are required');
    }

    await this.gaCredentialsRepository.deactivateByLandingPage(pageId);
    const url = this.googleOAuthService.getAuthUrl(brandId, pageId);
    return { url };
  }
}
