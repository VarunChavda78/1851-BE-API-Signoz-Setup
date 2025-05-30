import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';

// Controllers
import { GoogleOAuthController } from './controllers/ga-oauth.controller';
import { LandingAnalyticsStatusController } from './controllers/landing-analytics-status.controller';
import { GAPropertyController } from './controllers/ga-property.controller';
import { GADataController } from './controllers/ga-data.controller';
import { LandingAnalyticsController } from './controllers/landing-analytics.controller';

// Services
import { GoogleOAuthService } from './services/google-oauth.service';
import { TokenRefreshService } from './services/token-refresh.service';
import { GADataService } from './services/ga-data.service';
import { LandingAnalyticsService } from './services/landing-analytics.service';

// Repositories
import { GACredentialsRepository } from './repositories/ga-credentials.repository';
import { LpPageRepository } from 'src/landing/lp-page.repository';
import { LpGaSummaryRepository } from './repositories/lp-ga-summary.repository';
import { LpGaSyncStatusRepository } from './repositories/lp-ga-sync-status.repository';

// Entities
import { GACredential } from './ga-credential.entity';
import { LpGaSummary } from './lp-ga-summary.entity';
import { LpGaSyncStatus } from './lp-ga-sync-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GACredential, LpGaSummary, LpGaSyncStatus]),
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
