import { Injectable, Logger } from '@nestjs/common';
import { LpGaLocationMetricsRepository } from '../repositories/lp-ga-location-metrics.repository';

@Injectable()
export class GaHeatmapService {
  private readonly logger = new Logger(GaHeatmapService.name);

  constructor(
    private gaLocationMetricsRepository: LpGaLocationMetricsRepository
  ) {}

  async fetchHeatmapData(query: { startDate: string; endDate: string }, landingPageId = null) {
    const { startDate, endDate } = query;

    try {
      const readersLocation =
        await this.gaLocationMetricsRepository.fetchHeatmapData(landingPageId, startDate, endDate);

      const datas = readersLocation.map((location) => ({
        color: '#8aabb0',
        latitude: parseFloat(location.latitude).toFixed(4),
        longitude: parseFloat(location.longitude).toFixed(4),
        name: location.city,
        value: location.pageViews,
      }));

      return {
        status: true,
        message: 'Data fetched successfully',
        data: {
          coordinates: datas,
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
}
