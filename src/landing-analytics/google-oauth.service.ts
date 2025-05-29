import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { LpPageRepository } from 'src/landing/lp-page.repository';
import { GACredentialsRepository } from './ga-credentials.repository';
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

      console.log('mmm', {clientId, clientSecret, redirectUrl})
      
      if (!clientId || !clientSecret || !redirectUrl) {
        this.logger.error('Missing OAuth configuration. Check environment variables.');
        throw new Error('Missing OAuth configuration');
      }
      
      this.logger.log(`Initializing OAuth client with redirect URL: ${redirectUrl}`);
      
      this.oauthClient = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUrl
      );
    } catch (error) {
      this.logger.error('Error initializing OAuth client', error);
      throw error;
    }
  }

  getAuthUrl(brandId: number, pageId: number): string {
    // Store state to verify callback and associate with brand/landing page
    const state = Buffer.from(JSON.stringify({ brandId, pageId })).toString('base64');
    
    return this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/analytics.readonly'
      ],
      prompt: 'consent', // Force to get refresh_token
      state
    });
  }


async handleCallback(code: string, state: string): Promise<any> {
  try {
    // Exchange code for tokens
    const { tokens } = await this.oauthClient.getToken(code);
    
    // Decode state to get brandId and pageId
    const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
    const { brandId, pageId } = decodedState;
    
    // Store tokens in database
    await this.storeTokens(brandId, pageId, tokens);
    
    return { success: true };
  } catch (error) {
    this.logger.error('Error handling OAuth callback', error);
    return { success: false, error: error.message };
  }
}

private async storeTokens(brandId: number, pageId: number, tokens: any): Promise<void> {
  try {
    // Calculate token expiration with proper error handling
    let expiresAt = new Date();
    if (tokens.expires_in) {
      expiresAt.setSeconds(expiresAt.getSeconds() + (tokens.expires_in || 3600));
    } else {
      // Default to 1 hour if expires_in is not provided
      expiresAt.setHours(expiresAt.getHours() + 1);
    }
    
    // Check if credential already exists
    const existingCredentials = await this.gaCredentialsRepository.findByBrandId(brandId);
    let credential = existingCredentials.length > 0 ? existingCredentials[0] : null;
    
    let landingPage = null;
    if (pageId) {
      landingPage = await this.lpPageRepository.findOne({ where: { id: pageId } });
    }
    
    if (credential) {
      // Update existing
      credential.accessToken = tokens.access_token;
      // Only update refresh token if provided
      if (tokens.refresh_token) {
        credential.refreshToken = tokens.refresh_token;
      }
      credential.expiresAt = expiresAt;
      credential.isActive = true;
      
      await this.gaCredentialsRepository.save(credential);
    } else {
      // Create new
      await this.gaCredentialsRepository.create({
        brandId,
        landingPage,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || '', // Handle case when refresh token is not provided
        expiresAt,
        isActive: true
      });
    }
  } catch (error) {
    this.logger.error('Error storing tokens', error);
    throw error; // Re-throw to be caught by the handleCallback method
  }
}

async refreshToken(credentialId: number): Promise<boolean> {
  try {
    const credential = await this.gaCredentialsRepository.findOne(credentialId);
    if (!credential || !credential.refreshToken) {
      this.logger.error(`No valid refresh token found for credential ${credentialId}`);
      return false;
    }
    
    this.logger.log(`Refreshing token for credential ${credentialId}`);
    
    // Set up the OAuth client with the refresh token
    this.oauthClient.setCredentials({
      refresh_token: credential.refreshToken
    });
    
    try {
      // Attempt to refresh the token
      const { tokens } = await this.oauthClient.refreshAccessToken();
      
      this.logger.log(`Token refresh response received for credential ${credentialId}`);
      
      // Validate the response
      if (!tokens || !tokens.access_token) {
        this.logger.error(`Invalid token response for credential ${credentialId}`, tokens);
        return false;
      }
      
      // Update token in database with error handling for missing expires_in
      const expiresAt = new Date();
      // Use default expiration of 1 hour if expires_in is not provided
      const expiresIn = tokens.expires_in || 3600;
      expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
      
      this.logger.log(`Updating credential ${credentialId} with new token expiring at ${expiresAt}`);
      
      credential.accessToken = tokens.access_token;
      credential.expiresAt = expiresAt;
      
      await this.gaCredentialsRepository.save(credential);
      
      return true;
    } catch (refreshError) {
      this.logger.error(`Error during token refresh for credential ${credentialId}: ${refreshError.message}`, refreshError);
      
      // Log the full error details for debugging
      if (refreshError.response) {
        this.logger.error(`Error details: ${JSON.stringify(refreshError.response.data || {})}`);
      }
      
      // If refresh fails due to invalid_grant, the refresh token is no longer valid
      // This can happen if the user revoked access or the token was revoked by Google
      if (refreshError.message && refreshError.message.includes('invalid_grant')) {
        this.logger.warn(`Refresh token is invalid for credential ${credentialId}, marking as inactive`);
        
        // Mark the credential as inactive
        credential.isActive = false;
        await this.gaCredentialsRepository.save(credential);
      }
      
      return false;
    }
  } catch (error) {
    this.logger.error(`Error refreshing token for credential ${credentialId}: ${error.message}`, error);
    return false;
  }
}
}
