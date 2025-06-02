import {
  Controller,
  Get,
  Post,
  Query,
  Logger,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { LandingAnalyticsService } from '../services/landing-analytics.service';
import * as dayjs from 'dayjs';
import { GaSummaryService } from '../services/ga-summary.service';
import { GaReadersService } from '../services/ga-readers.service';
import { GaReadsService } from '../services/ga-reads.service';

@Controller({
  version: '1',
  path: 'landing-analytics',
})
export class LandingAnalyticsController {
  private readonly logger = new Logger(LandingAnalyticsController.name);

  constructor(
    private landingAnalyticsService: LandingAnalyticsService,
    private gaSummaryService: GaSummaryService,
    private gaReadersService: GaReadersService,
    private gaReadsService: GaReadsService,
  ) {}

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
    @Query('landingPageId') landingPageId: number,
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

  // Summary data
  @Get('summary/:landingPageId')
  async fetchSummaryData(
    @Param('landingPageId') landingPageId: number,
    @Query() query: { startDate: string; endDate: string },
  ) {
    this.logger.log('All Summary data | Query Parameter', query);
    return await this.gaSummaryService.fetchSummaryData(query, landingPageId);
  }

  // Brand Readers graph data
  @Get('readers/:landingPageId')
  async fetchBrandReadersData(
    @Param('landingPageId') landingPageId: number,
    @Query() query: { startDate: string; endDate: string },
  ) {
    this.logger.log(
      `Brand Readers graph data: landingPageId -> ${landingPageId} | Query Parameter`,
      query,
    );
    return await this.gaReadersService.fetchReadersData(query, landingPageId);
  }

  // Brand Reads graph data
  @Get('reads/:landingPageId')
  async fetchBrandReadsData(
    @Param('landingPageId') landingPageId: number,
    @Query() query: { startDate: string; endDate: string },
  ) {
    this.logger.log(
      `Brand Reads graph data: landingPageId -> ${landingPageId} | Query Parameter`,
      query,
    );
    return await this.gaReadsService.fetchReadsData(query, landingPageId);
  }
}
