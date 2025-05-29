import { Controller, Get, Post, Query, Logger } from '@nestjs/common';
import { LandingAnalyticsService } from '../services/landing-analytics.service';
import * as dayjs from 'dayjs'

@Controller({
  version: '1',
  path: 'landing-analytics',
})
export class LandingAnalyticsDataController {
  private readonly logger = new Logger(LandingAnalyticsDataController.name);
  
  constructor(private landingAnalyticsService: LandingAnalyticsService) {}

  @Get('data')
  async getAnalyticsData(
    @Query('brandId') brandId: number,
    @Query('landingPageId') landingPageId: number,
    @Query('startDate') startDate: string = dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    @Query('endDate') endDate: string = dayjs().format('YYYY-MM-DD')
  ) {
    this.logger.log(`Getting analytics data for brand ${brandId}, page ${landingPageId || 'all'}`);
    return this.landingAnalyticsService.getAnalyticsData(brandId, startDate, endDate, landingPageId);
  }

  @Get('sync-status')
  async getSyncStatus(
    @Query('brandId') brandId: number,
    @Query('landingPageId') landingPageId: number
  ) {
    this.logger.log(`Getting sync status for brand ${brandId}, page ${landingPageId || 'all'}`);
    return this.landingAnalyticsService.getSyncStatus(brandId, landingPageId);
  }

  @Post('sync')
  async triggerSync(
    @Query('brandId') brandId: number,
    @Query('landingPageId') landingPageId: number
  ) {
    this.logger.log(`Triggering sync for brand ${brandId}, page ${landingPageId || 'all'}`);
    return this.landingAnalyticsService.triggerManualSync(brandId, landingPageId);
  }
}
