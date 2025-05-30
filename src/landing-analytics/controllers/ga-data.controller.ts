import { Controller, Get, Query, Logger } from '@nestjs/common';
import { GADataService } from '../services/ga-data.service';

@Controller({
  version: '1',
  path: 'landing-analytics/data',
})
export class GADataController {
  private readonly logger = new Logger(GADataController.name);

  constructor(private gaDataService: GADataService) {}

  @Get()
  async getAnalyticsData(
    @Query('brandId') brandId: number,
    @Query('startDate') startDate: string = '7daysAgo',
    @Query('endDate') endDate: string = 'today',
  ) {
    this.logger.log(
      `Getting analytics data for brand ${brandId} from ${startDate} to ${endDate}`,
    );
    return this.gaDataService.getAnalyticsData(brandId, startDate, endDate);
  }
}
