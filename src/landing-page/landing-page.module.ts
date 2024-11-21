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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LandingPage,
      LandingPageCustomisation,
      LandingPageSection,
    ]),
    UsersModule,
  ],
  controllers: [LandingPageController],
  providers: [
    LandingPageService,
    LandingPageRepository,
    LandingPageCustomisationRepository,
    LandingPageSectionRepository,
  ],
})
export class LandingPageModule {}
