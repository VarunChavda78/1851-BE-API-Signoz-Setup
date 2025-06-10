// services/google-oauth.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { LpPageRepository } from 'src/landing/lp-page.repository';
import { GACredentialsRepository } from '../repositories/ga-credentials.repository';
import { EnvironmentConfigService } from 'src/shared/config/environment-config.service';

@Injectable()
export class GoogleOAuthService {
  private readonly logger = new Logger(GoogleOAuthService.name);
  private oauthClient;

  constructor(
    private readonly env: EnvironmentConfigService,
    private gaCredentialsRepository: GACredentialsRepository,
    private lpPageRepository: LpPageRepository,
  ) {
    this.initializeOAuthClient();
  }

  private initializeOAuthClient() {
    try {
      const clientId = this.env.getGoogleClientId();
      const clientSecret = this.env.getGoogleClientSecret();
      const redirectUrl = this.env.getGoogleRedirectUrl();

      console.log('mmm', { clientId, clientSecret, redirectUrl });

      if (!clientId || !clientSecret || !redirectUrl) {
        this.logger.error(
          'Missing OAuth configuration. Check environment variables.',
        );
        throw new Error('Missing OAuth configuration');
      }

      this.logger.log(
        `Initializing OAuth client with redirect URL: ${redirectUrl}`,
      );

      this.oauthClient = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUrl,
      );
    } catch (error) {
      this.logger.error('Error initializing OAuth client', error);
      throw error;
    }
  }

  // Change pageId to landingPageId in this method
  getAuthUrl(brandId: number, landingPageId: number): string {
    // Store state to verify callback and associate with brand/landing page
    const state = Buffer.from(
      JSON.stringify({ brandId, landingPageId }),
    ).toString('base64');

    return this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/analytics'
      ],
      prompt: 'consent',
      include_granted_scopes: true,
      state,
    });
  }

  async handleCallback(code: string, state: string): Promise<any> {
    try {
      // Exchange code for tokens
      const { tokens } = await this.oauthClient.getToken(code);

      // Decode state to get brandId and landingPageId
      const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
      const { brandId, landingPageId } = decodedState;

      // Store tokens in database
      await this.storeTokens(brandId, landingPageId, tokens);

      return { success: true };
    } catch (error) {
      this.logger.error('Error handling OAuth callback', error);
      return { success: false, error: error.message };
    }
  }

  private async storeTokens(
    brandId: number,
    landingPageId: number,
    tokens: any,
  ): Promise<void> {
    try {
      // Calculate token expiration
      const expiresAt = new Date();
      expiresAt.setSeconds(
        expiresAt.getSeconds() + (tokens.expires_in || 3600),
      );

      // Find existing credential for this landing page
      const existingCredentials =
        await this.gaCredentialsRepository.findByLandingPageId(landingPageId);
      let credential =
        existingCredentials.length > 0 ? existingCredentials[0] : null;

      const landingPage = await this.lpPageRepository.findOne({
        where: { id: landingPageId },
      });

      if (credential) {
        // Update existing
        credential.accessToken = tokens.access_token;
        if (tokens.refresh_token) {
          credential.refreshToken = tokens.refresh_token;
        }
        credential.expiresAt = expiresAt;
        credential.isActive = true;
      } else {
        // Create new
        credential = await this.gaCredentialsRepository.create({
          brandId,
          landingPage,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || '',
          expiresAt,
          isActive: true,
        });
      }

      await this.gaCredentialsRepository.save(credential);
    } catch (error) {
      this.logger.error('Error storing tokens', error);
      throw error;
    }
  }

  async refreshToken(credentialId: number): Promise<boolean> {
    try {
      const credential = await this.gaCredentialsRepository.findOneById(credentialId);
      if (!credential || !credential.refreshToken) {
        this.logger.error(
          `No valid refresh token found for credential ${credentialId}`,
        );
        return false;
      }

      this.logger.log(`Refreshing token for credential ${credentialId}`);

      // Set up the OAuth client with the refresh token
      this.oauthClient.setCredentials({
        refresh_token: credential.refreshToken,
      });

      try {
        // Attempt to refresh the token
        const { tokens } = await this.oauthClient.refreshAccessToken();

        this.logger.log(
          `Token refresh response received for credential ${credentialId}`,
        );

        // Validate the response
        if (!tokens || !tokens.access_token) {
          this.logger.error(
            `Invalid token response for credential ${credentialId}`,
            tokens,
          );
          return false;
        }

        // Calculate new expiration time
        const expiresAt = new Date();
        const expiresIn = tokens.expires_in || 3600;
        expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

        // Update the credential with new token information
        credential.accessToken = tokens.access_token;
        credential.expiresAt = expiresAt;
        
        // If we got a new refresh token, update it
        if (tokens.refresh_token) {
          credential.refreshToken = tokens.refresh_token;
        }

        await this.gaCredentialsRepository.save(credential);
        
        this.logger.log(
          `Successfully refreshed token for credential ${credentialId}, expires at ${expiresAt}`,
        );

        return true;
      } catch (refreshError) {
        this.logger.error(
          `Error during token refresh for credential ${credentialId}: ${refreshError.message}`,
          refreshError,
        );

        // Handle specific error cases
        if (refreshError.message?.includes('invalid_grant')) {
          this.logger.warn(
            `Refresh token is invalid for credential ${credentialId}, marking as inactive`,
          );
          credential.isActive = false;
          await this.gaCredentialsRepository.save(credential);
        }

        return false;
      }
    } catch (error) {
      this.logger.error(
        `Error in refresh token process for credential ${credentialId}: ${error.message}`,
        error,
      );
      return false;
    }
  }
}
