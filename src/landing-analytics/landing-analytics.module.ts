// src/landing-analytics/landing-analytics.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';

// Controllers
import { LandingAnalyticsController } from './landing-analytics.controller';
import { GoogleOAuthController } from './ga-oauth.controller';
import { LandingAnalyticsStatusController } from './landing-analytics-status.controller';
import { GAPropertyController } from './ga-property.controller';
import { GADataController } from './ga-data.controller';
import { LandingAnalyticsDataController } from './controllers/landing-analytics-data.controller';

// Services
import { GoogleOAuthService } from './google-oauth.service';
import { TokenRefreshService } from './token-refresh.service';
import { GADataService } from './ga-data.service';
import { LandingAnalyticsService } from './services/landing-analytics.service';

// Repositories
import { GACredentialsRepository } from './ga-credentials.repository';
import { LpPageRepository } from 'src/landing/lp-page.repository';
import { LpGaSummaryRepository } from './repositories/lp-ga-summary.repository';
import { LpGaSyncStatusRepository } from './repositories/lp-ga-sync-status.repository';

// Entities
import { GACredential } from './ga-credential.entity';
import { LpGaSummary } from './lp-ga-summary.entity';
import { LpGaSyncStatus } from './lp-ga-sync-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GACredential,
      LpGaSummary,
      LpGaSyncStatus
    ]), 
    SharedModule, 
    UsersModule,
  ],
  controllers: [
    LandingAnalyticsController,
    GoogleOAuthController,
    LandingAnalyticsStatusController,
    GAPropertyController,
    GADataController,
    LandingAnalyticsDataController,
  ],
  providers: [
    GoogleOAuthService,
    TokenRefreshService,
    GADataService,
    LandingAnalyticsService,
    GACredentialsRepository,
    LpPageRepository,
    LpGaSummaryRepository,
    LpGaSyncStatusRepository,
  ],
  exports: [
    GoogleOAuthService,
    TokenRefreshService,
    GADataService,
    LandingAnalyticsService,
  ],
})
export class LandingAnalyticsModule {}
