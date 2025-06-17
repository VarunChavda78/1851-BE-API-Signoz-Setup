import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GoogleOAuthService } from './google-oauth.service';
import { GACredentialsRepository } from '../repositories/ga-credentials.repository';
import { LessThan } from 'typeorm';

@Injectable()
export class TokenRefreshService {
  private readonly logger = new Logger(TokenRefreshService.name);

  constructor(
    private gaCredentialsRepository: GACredentialsRepository,
    private googleOAuthService: GoogleOAuthService,
  ) {}

  // @Cron('*/5 * * * * *', {
  //   name: 'testCron',
  // }) // Run every 5 seconds
  // async testCron() {
  //   try{
  //     console.log('mmm hello cron');
  //     this.logger.log('mmm hello cron');
  //   } catch (error) {
  //     this.logger.error('Error in testCron', error);
  //   }
  // }

  @Cron('*/15 * * * *', {
    name: 'refreshExpiredTokens',
  }) // Run every 15 minutes
  async refreshExpiredTokens() {
    this.logger.log('Starting scheduled token refresh job');

    try {
      // Get tokens that will expire in the next 30 minutes
      const expiryThreshold = new Date();
      expiryThreshold.setMinutes(expiryThreshold.getMinutes() + 30);

      const tokensToRefresh = await this.gaCredentialsRepository.findTokensToRefresh(expiryThreshold);

      this.logger.log(`Found ${tokensToRefresh.length} tokens to refresh`);

      for (const token of tokensToRefresh) {
        try {
          this.logger.log(
            `Attempting to refresh token ${token.id}, expires at ${token.expiresAt}`,
          );
          const success = await this.googleOAuthService.refreshToken(token.id);
          this.logger.log(
            `Token ${token.id} refresh ${success ? 'successful' : 'failed'}`,
          );

          if (!success) {
            // If refresh failed, mark the token as inactive
            token.isActive = false;
            await this.gaCredentialsRepository.save(token);
            this.logger.warn(`Marked token ${token.id} as inactive due to refresh failure`);
          }
        } catch (error) {
          this.logger.error(
            `Error refreshing token ${token.id}: ${error.message}`,
            error.stack,
          );
          
          // Mark token as inactive if there's an error
          token.isActive = false;
          await this.gaCredentialsRepository.save(token);
        }
      }
    } catch (error) {
      this.logger.error('Error in token refresh job:', error.stack);
    }
  }
}
