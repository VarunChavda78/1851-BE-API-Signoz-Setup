import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingPage } from './landing-page.entity';
import { LandingPageCustomisation } from './landing-page-customisation.entity';
import { LandingPageSection } from './landing-page-section.entity';
import { LandingPageController } from './landing-page.controller';
import { LandingPageService } from './landing-page.service';
import { LandingPageRepository } from './landing-page.repository';
import { LandingPageCustomisationRepository } from './landing-page-customisation.repository';
import { LandingPageSectionRepository } from './landing-page-section.repository'; // Import new repository
import { UsersModule } from 'src/users/users.module';
import { LandingPagePublish } from './landing-page-publish.entity';
import { LandingPagePublishRepository } from './landing-page-publish.repository';
import { LandingPageLeads } from './landing-page-leads.entity';
import { LandingPageLeadsRepository } from './landing-page-leads.repository';
import { CommonService } from 'src/shared/services/common.service';
import { SharedModule } from 'src/shared/shared.module';
import { HttpModule } from '@nestjs/axios';
import { EnvironmentConfigService } from 'src/shared/config/environment-config.service';
import { LeadsUtilService } from './leads-utils.service';
import { LandingModule } from 'src/landing/landing.module';
import { S3Module } from 'src/s3/s3.module';
import { S3Service } from 'src/s3/s3.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LandingPage,
      LandingPageCustomisation,
      LandingPageSection,
      LandingPagePublish,
      LandingPageLeads,
    ]),
    UsersModule,
    HttpModule,
    SharedModule,
    LandingModule,
    S3Module
  ],
  controllers: [LandingPageController],
  providers: [
    LandingPageService,
    LandingPageRepository,
    LandingPageCustomisationRepository,
    LandingPageSectionRepository,
    LandingPagePublishRepository,
    LandingPageLeadsRepository,
    CommonService,
    EnvironmentConfigService,
    LeadsUtilService,
    S3Service,
    AuthService
  ],
})
export class LandingPageModule {}
