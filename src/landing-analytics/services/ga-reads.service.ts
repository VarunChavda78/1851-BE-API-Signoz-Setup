import { Injectable, Logger } from '@nestjs/common';
import { LpGaSummaryRepository } from '../repositories/lp-ga-summary.repository';
import { LandingAnalyticsHelperService } from './landing-analytics-helper.service';


@Injectable()
export class GaReadsService {
  private readonly logger = new Logger(GaReadsService.name);

  constructor(
    private gaSummaryRepository: LpGaSummaryRepository,
        private helper: LandingAnalyticsHelperService,
    
  ) {}

  async fetchReadsData(
    query: { startDate: string; endDate: string },
    landingPageId = null,
  ) {
    const { startDate, endDate } = query;

    try {
      // Fetch data for the given date range
      const currentData = await this.gaSummaryRepository.findByLandingPageId(
        landingPageId,
        startDate,
        endDate,
      );

      // Calculate the total number of users in the current date range
      const totalViewsCurrent = currentData.reduce(
        (sum, record) => sum + record.pageViews,
        0,
      );

      const { previousStartDate, previousEndDate } = this.helper.getPreviousDates(
        startDate,
        endDate,
      );

      // Fetch data for the previous date range
      const preStartData = previousStartDate.toISOString().split('T')[0];
      const preEndData = previousEndDate.toISOString().split('T')[0];
      let previousData = await this.gaSummaryRepository.findByLandingPageId(
        landingPageId,
        preStartData,
        preEndData,
      );

      // Calculate the total number of users in the previous date range
      const totalViewsPrevious = previousData.reduce(
        (sum, record) => sum + record.pageViews,
        0,
      );

      // Calculate percentage change and status for users
      const viewPercentageChange = totalViewsPrevious
        ? ((totalViewsCurrent - totalViewsPrevious) / totalViewsPrevious) * 100
        : 100;
      const viewStatus = totalViewsCurrent > totalViewsPrevious ? 'up' : 'down';

      const graph = currentData
        ?.map((item) => ({
          views: item?.pageViews,
          date: item?.date,
        }))
        ?.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      const data = {
        total: totalViewsCurrent.toFixed(0),
        percentage: Math.abs(Math.floor(viewPercentageChange)),
        status: viewStatus,
        graph: this.helper.groupAndSumProperty(graph, 'views') || [],
      };

      return {
        status: true,
        message: 'Data fetched successfully',
        data: data || {},
      };
    } catch (error) {
      this.logger.error('Error fetching data from DB', error.message);
      return {
        status: false,
        message: 'Data not fetched successfully',
        error: error?.message,
      };
    }
  }
}
