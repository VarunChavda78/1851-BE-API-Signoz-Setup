import { Injectable, Logger } from '@nestjs/common';
import { LpGaSummaryRepository } from '../repositories/lp-ga-summary.repository';
import { LandingAnalyticsHelperService } from './landing-analytics-helper.service';

@Injectable()
export class GaSummaryService {
  private readonly logger = new Logger(GaSummaryService.name);

  constructor(
    private gaSummaryRepository: LpGaSummaryRepository,
    private helper: LandingAnalyticsHelperService,
  ) {}

  async fetchSummaryData(
    query: { startDate: string; endDate: string },
    landingPageId: number
  ) {
    const { startDate, endDate } = query;

    try {
      // Fetch data for the given date range
      const currentData = await this.gaSummaryRepository.findByLandingPageId(
        landingPageId,
        startDate,
        endDate
      );


      // Calculate the total number of users in the current date range
      const totalUsersCurrent = currentData.reduce(
        (sum, record) => sum + record.users,
        0
      );

      // Calculate the total session duration in the current date range
      const totalAvgSessionDurationCurrent = currentData.reduce(
        (sum, record) => sum + record.avgSessionDuration,
        0
      );

      const totalSessionCurrent = currentData.reduce(
        (sum, record) => sum + record.sessions,
        0
      );

      // Determine the number of days in the current date range
      const dateDifference =
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 3600 * 24) +
        1;

      // Calculate the average users per day in the current date range
      const avgUsersPerDayCurrent = totalUsersCurrent / dateDifference;

      // Calculate the average session duration in the current date range
      const avgSessionDurationCurrent =
        totalAvgSessionDurationCurrent / totalSessionCurrent;

      const { previousStartDate, previousEndDate } =
        this.helper.getPreviousDates(startDate, endDate);

      // Fetch data for the previous date range
      const preStartData = previousStartDate.toISOString().split('T')[0];
      const preEndData = previousEndDate.toISOString().split('T')[0];
      let previousData = await this.gaSummaryRepository.findByLandingPageId(
        landingPageId,
        preStartData,
        preEndData
      );

      // Calculate the total number of users in the previous date range
      const totalUsersPrevious = previousData.reduce(
        (sum, record) => sum + record.users,
        0
      );

      // Calculate the total session duration in the previous date range
      const totalAvgSessionDurationPrevious = previousData.reduce(
        (sum, record) => sum + record.avgSessionDuration,
        0
      );
      const totalSessionPrevious = previousData.reduce(
        (sum, record) => sum + record.sessions,
        0
      );

      // Calculate percentage change and status for users
      const userPercentageChange = totalUsersPrevious
        ? ((totalUsersCurrent - totalUsersPrevious) / totalUsersPrevious) * 100
        : 100;
      const userStatus = totalUsersCurrent > totalUsersPrevious ? 'up' : 'down';

      const avgUserPercentageChange = totalUsersPrevious
        ? ((avgUsersPerDayCurrent - totalUsersPrevious / dateDifference) /
            (totalUsersPrevious / dateDifference)) *
          100
        : 100;
      const avgUserStatus =
        avgUsersPerDayCurrent > totalUsersPrevious / dateDifference
          ? 'up'
          : 'down';

      // Calculate percentage change and status for session duration
      const avgSessionDurationPrevious =
        totalAvgSessionDurationPrevious / totalSessionPrevious;
      const avgSessionDurationPercentageChange = avgSessionDurationPrevious
        ? ((avgSessionDurationCurrent - avgSessionDurationPrevious) /
            avgSessionDurationPrevious) *
          100
        : 100;

      const avgSessionDurationStatus =
        (avgSessionDurationCurrent || 0) > (avgSessionDurationPrevious || 0)
          ? 'up'
          : 'down';

      // Convert session duration to HH:mm:ss format
      const formatDuration = (durationInSeconds: number) => {
        const hours = Math.floor(durationInSeconds / 3600) || 0;
        const minutes = Math.floor((durationInSeconds % 3600) / 60) || 0;
        const seconds = Math.floor(durationInSeconds % 60) || 0;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
          2,
          '0'
        )}:${String(seconds).padStart(2, '0')}`;
      };

      const data = [
        {
          title: 'Total Readers',
          shortCode: 'TR',
          total: totalUsersCurrent.toFixed(0),
          percentage: Math.abs(Math.floor(userPercentageChange)),
          status: userStatus,
        },
        {
          title: 'AVG. Readers Per Day',
          shortCode: 'ARD',
          total: avgUsersPerDayCurrent.toFixed(2),
          percentage: Math.abs(Math.floor(avgUserPercentageChange)),
          status: avgUserStatus,
        },
        {
          title: 'AVG. Session Duration',
          shortCode: 'ASD',
          total: formatDuration(avgSessionDurationCurrent),
          percentage: Math.abs(Math.floor(avgSessionDurationPercentageChange)),
          status: avgSessionDurationStatus,
        },
      ];

      return {
        status: true,
        message: 'Data fetched successfully',
        data: { summary: data || [] },
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
