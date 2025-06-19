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
import { GaSummaryService } from '../services/ga-summary.service';
import { GaReadersService } from '../services/ga-readers.service';
import { GaReadsService } from '../services/ga-reads.service';
import { ActiveMarketsQueryDto } from '../dtos/active-markets-query.dto';
import { GaActiveMarketsService } from '../services/ga-active-markets.service';
import { GaHeatmapService } from '../services/ga-heatmap.service';

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
    private gaActiveMarketsService: GaActiveMarketsService,
    private gaHeatmapService: GaHeatmapService,
  ) {}


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
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (!brandId || !landingPageId) {
      throw new BadRequestException(
        'Both Brand ID and Landing Page ID are required',
      );
    }

    return this.landingAnalyticsService.triggerManualSync(
      brandId,
      landingPageId,
      { startDate, endDate }
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

  // Brand Active Markets data
  @Get('active-markets/:landingPageId')
  async fetchBrandActiveMarketsData(
    @Param('landingPageId') landingPageId: number,
    @Query() query: ActiveMarketsQueryDto,
  ) {
    this.logger.log(
      `Brand Active Markets data: landingPageId -> ${landingPageId} | Query Parameter`,
      query,
    );
    return await this.gaActiveMarketsService.fetchActiveMarketsData(
      query,
      landingPageId,
    );
  }

  // Brand Heatmap data
  @Get('heatmap/:id')
  async fetchBrandHeatmapData(
    @Param('id') id: number,
    @Query() query: { startDate: string; endDate: string },
  ) {
    this.logger.log(
      `Brand Heatmap data:  brand id -> ${id} | Query Parameter`,
      query,
    );
    return await this.gaHeatmapService.fetchHeatmapData(query, id);
  }

  // Country metrics endpoint
  @Get('country/:landingPageId')
  async fetchCountryMetrics(
    @Param('landingPageId') landingPageId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }
    return await this.landingAnalyticsService.getCountryMetrics(
      landingPageId,
      startDate,
      endDate,
      sort || 'views',
      order || 'desc',
      limit ? Number(limit) : 5,
      page ? Number(page) : 1,
    );
  }

  // State metrics endpoint
  @Get('state/:landingPageId')
  async fetchStateMetrics(
    @Param('landingPageId') landingPageId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }
    return await this.landingAnalyticsService.getStateMetrics(
      landingPageId,
      startDate,
      endDate,
      sort || 'views',
      order || 'desc',
      limit ? Number(limit) : 5,
      page ? Number(page) : 1,
    );
  }

  // City metrics endpoint
  @Get('city/:landingPageId')
  async fetchCityMetrics(
    @Param('landingPageId') landingPageId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }
    return await this.landingAnalyticsService.getCityMetrics(
      landingPageId,
      startDate,
      endDate,
      sort || 'views',
      order || 'desc',
      limit ? Number(limit) : 5,
      page ? Number(page) : 1,
    );
  }
}
