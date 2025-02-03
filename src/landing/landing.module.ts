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
import { LeadsUtilService } from './leads-utils.service';
import { CommonService } from 'src/shared/services/common.service';
import { AuthService } from 'src/auth/auth.service';
import { VerifyCaptchaService } from 'src/shared/services/verify-captcha.service';
import { LpLeadsRepository } from './lp-leads.repository';
import { HttpModule } from '@nestjs/axios';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [UsersModule, SharedModule, HttpModule],
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
    LeadsUtilService,
    CommonService,
    AuthService,
    VerifyCaptchaService,
    LpLeadsRepository,
    S3Service
  ],
  exports: [
    LpPdfRepository,
  ],
})
export class LandingModule {}
