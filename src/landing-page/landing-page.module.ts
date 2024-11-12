import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingPage } from './landing-page.entity'; // Ensure correct path
import { LandingPageController } from './landing-page.controller';
import { LandingPageService } from './landing-page.service';
import { LandingPageRepository } from './landing-page.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LandingPage])],
  controllers: [LandingPageController],
  providers: [LandingPageService, LandingPageRepository],
})
export class LandingPageModule {}
