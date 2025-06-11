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
import { TokenRefreshService } from '../services/token-refresh.service';

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
    private readonly tokenRefreshService: TokenRefreshService,
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

  @Get('status')
  async getConnectionStatus(
    @Query('brandId') brandId?: number,
    @Query('landingPageId') landingPageId?: number,
  ) {
    try {
      let credentials;
      
      if (landingPageId) {
        credentials = await this.gaCredentialsRepository.findByLandingPageId(landingPageId);
      } else if (brandId) {
        credentials = await this.gaCredentialsRepository.findByBrandId(brandId);
      } else {
        credentials = await this.gaCredentialsRepository.findActiveWithPropertyId();
      }

      const now = new Date();
      const results = credentials.map(cred => {
        const expiresAt = new Date(cred.expiresAt);
        const timeLeft = expiresAt.getTime() - now.getTime();
        
        // Calculate time components
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        return {
          credentialId: cred.id,
          brandId: cred.brandId,
          landingPageId: cred.landingPage?.id,
          propertyId: cred.propertyId,
          isActive: cred.isActive,
          isValid: timeLeft > 0 && cred.isActive,
          expiresAt: cred.expiresAt,
          timeLeft: timeLeft > 0 ? `${hours}h ${minutes}m ${seconds}s` : 'Expired',
          hasRefreshToken: !!cred.refreshToken,
          createdAt: cred.createdAt,
          updatedAt: cred.updatedAt
        };
      });

      return {
        success: true,
        totalConnections: results.length,
        activeConnections: results.filter(r => r.isValid).length,
        connections: results
      };
    } catch (error) {
      this.logger.error('Error fetching GA connection status:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get('refresh-tokens')
  async triggerTokenRefresh() {
    try {
      this.logger.log('Manually triggering token refresh');
      await this.tokenRefreshService.refreshExpiredTokens();
      return {
        success: true,
        message: 'Token refresh job triggered successfully'
      };
    } catch (error) {
      this.logger.error('Error triggering token refresh:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}
