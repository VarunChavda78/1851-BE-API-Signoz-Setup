import { Injectable, Logger } from '@nestjs/common';
import { ActiveMarketsQueryDto } from '../dtos/active-markets-query.dto';
import { LpGaLocationMetricsRepository } from '../repositories/lp-ga-location-metrics.repository';

@Injectable()
export class GaActiveMarketsService {
  private readonly logger = new Logger(GaActiveMarketsService.name);

  constructor(
    private gaLocationMetricsRepository: LpGaLocationMetricsRepository,
  ) {}

  async fetchActiveMarketsData(
    query: ActiveMarketsQueryDto,
    landingPageId = null,
  ) {
    const {
      startDate,
      endDate,
      sort = 'rank',
      order = 'asc',
      limit = 5,
      page = 1,
    } = query;

    try {
      const citiesData =
        await this.gaLocationMetricsRepository.fetchMetrics(
          landingPageId,
          startDate,
          endDate,
        );

      // Sorting
      const result = this.sortByField(citiesData, sort, order);

      // Pagination
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = Number(startIndex) + Number(limit);
      const paginatedData = result.slice(startIndex, endIndex);

      return {
        status: true,
        message: 'Data fetched successfully',
        data: {
          cities: paginatedData,
          pagination: {
            limit: Number(limit),
            page: Number(page),
            totalRecords: citiesData.length,
          },
        },
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

  private sortByField(data, field, order = 'asc') {
    // Helper function to compare two values
    const compare = (a, b) => {
      if (order === 'asc') {
        return a - b;
      } else {
        return b - a;
      }
    };

    if (field === 'city') {
      data.sort((a, b) =>
        order === 'asc'
          ? a.city.localeCompare(b.city)
          : b.city.localeCompare(a.city),
      );
    } else if (field === 'users') {
      data.sort((a, b) => compare(parseInt(a.users), parseInt(b.users)));
    } else if (field === 'rank') {
      data.sort((a, b) => compare(a.rank, b.rank));
    } else if (field === 'duration') {
      const durationToSeconds = (duration) => {
        const [hours, minutes, seconds] = duration.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      };
      data.sort((a, b) =>
        compare(durationToSeconds(a.duration), durationToSeconds(b.duration)),
      );
    } else if (field === 'averageReads') {
      data.sort((a, b) =>
        compare(parseFloat(a.averageReads), parseFloat(b.averageReads)),
      );
    }
    return data || [];
  }
}
