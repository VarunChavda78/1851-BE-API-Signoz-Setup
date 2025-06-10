import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { LandingModule } from 'src/landing/landing.module';
import { LpPageRepository } from 'src/landing/lp-page.repository';

@Module({
  imports: [LandingModule],
  controllers: [DashboardController],
  providers: [LpPageRepository]
})
export class DashboardModule {}
