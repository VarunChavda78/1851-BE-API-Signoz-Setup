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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LandingPage,
      LandingPageCustomisation,
      LandingPageSection,
      LandingPagePublish,
      LandingPageLeads
    ]),
    UsersModule,
  ],
  controllers: [LandingPageController],
  providers: [
    LandingPageService,
    LandingPageRepository,
    LandingPageCustomisationRepository,
    LandingPageSectionRepository,
    LandingPagePublishRepository,
    LandingPageLeadsRepository,
    CommonService
  ],
})
export class LandingPageModule {}
