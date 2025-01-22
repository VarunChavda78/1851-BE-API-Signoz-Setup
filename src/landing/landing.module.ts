import { Module } from '@nestjs/common';
import { LandingController } from './landing.controller';
import { LandingService } from './landing.service';
import { LpTemplateRepository } from './lp-template.repository';
import { LpTemplatePageRepository } from './lp-template-page.repository';
import { LpSectionRepository } from './lp-section.repository';
import { LpPageRepository } from './lp-page.repository';
import { LpStatusRepository } from './lp-status.repository';
import { LpDomainHistoryRepository } from './lp-domain-history.repository';
import { LpCustomisationRepository } from './lp-customisation.repository';
import { UsersModule } from 'src/users/users.module';
import { SharedModule } from 'src/shared/shared.module';
import { LpPdfRepository } from './lp-pdf.repository';
import { LpSettingsRepository } from './lp-settings.repository';

@Module({
  imports: [UsersModule, SharedModule],
  controllers: [LandingController],
  providers: [
    LandingService,
    LpTemplateRepository,
    LpTemplatePageRepository,
    LpSectionRepository,
    LpPageRepository,
    LpStatusRepository,
    LpDomainHistoryRepository,
    LpCustomisationRepository,
    LpPdfRepository,
    LpSettingsRepository,
  ],
  exports: [
    LpPdfRepository,
  ],
})
export class LandingModule {}
