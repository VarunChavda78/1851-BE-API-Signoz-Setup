import {
  Controller,
  Get,
  Post,
  Query,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { LandingAnalyticsService } from '../services/landing-analytics.service';
import * as dayjs from 'dayjs';

@Controller({
  version: '1',
  path: 'landing-analytics',
})
export class LandingAnalyticsController {
  private readonly logger = new Logger(LandingAnalyticsController.name);

  constructor(private landingAnalyticsService: LandingAnalyticsService) {}

  @Get('data')
  async getAnalyticsData(
    @Query('brandId') brandId: number,
    @Query('landingPageId') landingPageId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (!brandId) throw new BadRequestException('Brand ID is required');
    if (!landingPageId)
      throw new BadRequestException('Landing Page ID is required');

    return this.landingAnalyticsService.getAnalyticsData(
      brandId,
      startDate || dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      endDate || dayjs().format('YYYY-MM-DD'),
      landingPageId,
    );
  }

  @Get('sync-status')
  async getSyncStatus(
    @Query('brandId') brandId: number,
    @Query('landingPageId') landingPageId?: number,
  ) {
    if (!brandId) throw new BadRequestException('Brand ID is required');
    if (!landingPageId)
      throw new BadRequestException('Landing Page ID is required');

    return this.landingAnalyticsService.getSyncStatus(brandId, landingPageId);
  }

  @Post('sync')
  async triggerSync(
    @Query('brandId') brandId: number,
    @Query('landingPageId') landingPageId: number, // Now required
  ) {
    if (!brandId || !landingPageId) {
      throw new BadRequestException(
        'Both Brand ID and Landing Page ID are required',
      );
    }

    return this.landingAnalyticsService.triggerManualSync(
      brandId,
      landingPageId,
    );
  }
}
