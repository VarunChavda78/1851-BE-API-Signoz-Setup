import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GoogleOAuthService } from './google-oauth.service';
import { GACredentialsRepository } from '../repositories/ga-credentials.repository';

@Injectable()
export class TokenRefreshService {
  private readonly logger = new Logger(TokenRefreshService.name);

  constructor(
    private gaCredentialsRepository: GACredentialsRepository,
    private googleOAuthService: GoogleOAuthService,
  ) {}

  @Cron('0 */4 * * *') // Every 4 hours
  async refreshExpiredTokens() {
    this.logger.log('Starting scheduled token refresh job');

    // Get tokens that expire in the next 6 hours
    const expiredTokens =
      await this.gaCredentialsRepository.findExpiredTokens();

    this.logger.log(`Found ${expiredTokens.length} tokens to refresh`);

    for (const token of expiredTokens) {
      const success = await this.googleOAuthService.refreshToken(token.id);
      this.logger.log(
        `Token ${token.id} refresh ${success ? 'successful' : 'failed'}`,
      );
    }
  }
}
