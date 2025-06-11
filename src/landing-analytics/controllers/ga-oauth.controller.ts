// controllers/ga-oauth.controller.ts
import {
  Controller,
  Get,
  Query,
  Redirect,
  Logger,
  BadRequestException,
} from '@nestjs/common';
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
    @Query('landingPageId') landingPageId: number,
  ) {
    if (!brandId || !landingPageId) {
      throw new BadRequestException(
        'Both Brand ID and Landing Page ID are required',
      );
    }

    const url = this.googleOAuthService.getAuthUrl(brandId, landingPageId);
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
    const { brandId, landingPageId } = decodedState;

    if (!brandId || !landingPageId) {
      throw new BadRequestException(
        'Missing brandId or landingPageId in state',
      );
    }

    const redirectUrl = `${this.env.getBrandPortalUrl()}/v2/landing/site-analytics?brandId=${brandId}&landingPageId=${landingPageId}`;

    if (error) {
      return {
        url: `${redirectUrl}&connection=error&message=${encodeURIComponent(
          error,
        )}`,
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
    @Query('landingPageId') landingPageId: number,
  ) {
    if (!brandId || !landingPageId) {
      throw new BadRequestException(
        'Both Brand ID and Landing Page ID are required',
      );
    }

    await this.gaCredentialsRepository.deactivateByLandingPage(landingPageId);
    const url = this.googleOAuthService.getAuthUrl(brandId, landingPageId);
    return { url };
  }
}
