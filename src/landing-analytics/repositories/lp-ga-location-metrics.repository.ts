// src/landing-analytics/repositories/lp-ga-location-metrics.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { LpGaLocationMetrics } from '../lp-ga-location-metrics.entity';

@Injectable()
export class LpGaLocationMetricsRepository {
  constructor(
    @InjectRepository(LpGaLocationMetrics)
    private repository: Repository<LpGaLocationMetrics>,
  ) {}

  async findByBrandId(
    brandId: number,
    startDate: string,
    endDate: string,
  ): Promise<LpGaLocationMetrics[]> {
    return this.repository.find({
      where: {
        brandId,
        date: Between(startDate, endDate),
      },
      order: {
        date: 'ASC',
      },
    });
  }

  async findByLandingPageId(
    landingPageId: number,
    startDate: string,
    endDate: string,
  ): Promise<LpGaLocationMetrics[]> {
    return this.repository.find({
      where: {
        landingPage: { id: landingPageId },
        date: Between(startDate, endDate),
      },
      order: {
        date: 'ASC',
      },
    });
  }

  async deleteByDateRange(
    startDate: string,
    endDate: string,
    brandId?: number,
    landingPageId?: number,
  ): Promise<void> {
    const whereClause: any = {
      date: Between(startDate, endDate),
    };

    if (brandId) {
      whereClause.brandId = brandId;
    }

    if (landingPageId) {
      whereClause.landingPage = { id: landingPageId };
    }

    await this.repository.delete(whereClause);
  }

  async save(data: Partial<LpGaLocationMetrics>): Promise<LpGaLocationMetrics> {
    return this.repository.save(data);
  }

  async fetchHeatmapData(
    brandId: number,
    landingPageId: number | null,
    startDate: string,
    endDate: string,
  ) {
    const query = this.repository
      .createQueryBuilder('metrics')
      .select([
        'metrics.city as city',
        'SUM(metrics.sessions) as sessions',
        'metrics.latitude as latitude',
        'metrics.longitude as longitude',
        'metrics.country as country',
        'metrics.state as state',
      ])
      .where('metrics.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('metrics.brandId = :brandId', { brandId })
      .andWhere("metrics.city != '(not set)'")
      .andWhere("metrics.city != ''");

    if (landingPageId) {
      query.andWhere('metrics.landingPageId = :landingPageId', {
        landingPageId,
      });
    }

    query
      .groupBy(
        'metrics.city, metrics.latitude, metrics.longitude, metrics.country, metrics.state',
      )
      .orderBy('SUM(metrics.sessions)', 'DESC');

    return query.getRawMany();
  }
}
