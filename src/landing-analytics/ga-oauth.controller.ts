import { Controller, Get, Query, Redirect, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleOAuthService } from './google-oauth.service';
import { GACredentialsRepository } from './ga-credentials.repository';

@Controller({
  version: '1',
  path: 'landing-analytics/auth/google',
})
export class GoogleOAuthController {
  private readonly logger = new Logger(GoogleOAuthController.name);
  
  constructor(
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly configService: ConfigService,
    private readonly gaCredentialsRepository: GACredentialsRepository
  ) {}

  @Get('connect')
  @Redirect()
  connect(@Query('brandId') brandId: number, @Query('pageId') pageId: number = 0) {
    this.logger.log(`Initiating Google OAuth connection for brand ${brandId}`);
    const url = this.googleOAuthService.getAuthUrl(brandId, pageId);
    return { url };
  }

  @Get('callback')
@Redirect()
async callback(
  @Query('code') code: string,
  @Query('state') state: string,
  @Query('error') error: string
) {
  this.logger.log('Received callback from Google OAuth');
  
  // Check if there's an error parameter
  if (error) {
    this.logger.error(`OAuth error: ${error}`);
    
    // Decode state to get brandId
    const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
    const { brandId } = decodedState;
    
    // Get the appropriate frontend URL based on environment
    const env = this.configService.get('NODE_ENV');
    let frontendBaseUrl;
    
    if (env === 'production') {
      frontendBaseUrl = 'https://brand.1851franchise.com';
    } else if (env === 'development') {
      frontendBaseUrl = 'https://brand.1851dev.com';
    } else {
      frontendBaseUrl = 'http://localhost:3000';
    }
    
    return { 
      url: `${frontendBaseUrl}/v2/landing/site-analytics?brandId=${brandId}&connection=error&message=${encodeURIComponent(error)}` 
    };
  }
  
  // No error, proceed with normal flow
  const result = await this.googleOAuthService.handleCallback(code, state);
  
  // Decode state to get brandId
  const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
  const { brandId } = decodedState;
  
  // Get the appropriate frontend URL based on environment
  const env = this.configService.get('NODE_ENV');
  let frontendBaseUrl;
  
  if (env === 'production') {
    frontendBaseUrl = 'https://brand.1851franchise.com';
  } else if (env === 'development') {
    frontendBaseUrl = 'https://brand.1851dev.com';
  } else {
    frontendBaseUrl = 'http://localhost:3000';
  }
  
  if (result.success) {
    // Redirect to success page
    return { 
      url: `${frontendBaseUrl}/v2/landing/site-analytics?brandId=${brandId}&connection=success` 
    };
  } else {
    // Redirect to error page
    return { 
      url: `${frontendBaseUrl}/v2/landing/site-analytics?brandId=${brandId}&connection=error&message=${encodeURIComponent(result.error)}` 
    };
  }
}

@Get('reconnect')
@Redirect()
async reconnect(@Query('brandId') brandId: number, @Query('pageId') pageId: number = 0) {
  this.logger.log(`Initiating Google OAuth reconnection for brand ${brandId}`);
  
  // Find and invalidate existing credentials
  const credentials = await this.gaCredentialsRepository.findByBrandId(brandId);
  
  for (const credential of credentials) {
    credential.isActive = false;
    await this.gaCredentialsRepository.save(credential);
  }
  
  // Redirect to the OAuth flow to create new credentials
  const url = this.googleOAuthService.getAuthUrl(brandId, pageId);
  return { url };
}
}
