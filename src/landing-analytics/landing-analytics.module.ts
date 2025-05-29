// src/landing-analytics/landing-analytics.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { LandingAnalyticsController } from './landing-analytics.controller';
import { GoogleOAuthController } from './ga-oauth.controller';
import { LandingAnalyticsStatusController } from './landing-analytics-status.controller';
import { GAPropertyController } from './ga-property.controller';
import { GADataController } from './ga-data.controller';
import { GoogleOAuthService } from './google-oauth.service';
import { TokenRefreshService } from './token-refresh.service';
import { GADataService } from './ga-data.service';
import { GACredentialsRepository } from './ga-credentials.repository';
import { LpPageRepository } from 'src/landing/lp-page.repository';
import { GACredential } from './ga-credential.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GACredential]), 
    SharedModule, 
    UsersModule,
  ],
  controllers: [
    LandingAnalyticsController,
    GoogleOAuthController,
    LandingAnalyticsStatusController,
    GAPropertyController,
    GADataController,
  ],
  providers: [
    GoogleOAuthService,
    TokenRefreshService,
    GADataService,
    GACredentialsRepository,
    LpPageRepository,
  ],
  exports: [
    GoogleOAuthService,
    TokenRefreshService,
    GADataService,
  ],
})
export class LandingAnalyticsModule {}
