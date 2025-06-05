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
      relations: ['landingPage'],
      where: {
        landingPage: { id: landingPageId },
        date: Between(startDate, endDate),
      },
      order: {
        date: 'ASC',
      },
    });
  }

async fetchMetrics(landingPageId: number, startDate: string, endDate: string) {
  const query = this.repository.createQueryBuilder('ga')
    .select('ga.city', 'city')
    .addSelect('SUM(ga.users)', 'activeUsers')
    .addSelect(
      "TO_CHAR(INTERVAL '1 second' * (SUM(ga.avgSessionDuration * ga.sessions) / NULLIF(SUM(ga.sessions), 0)), 'HH24:MI:SS')",
      'duration'
    )
    .addSelect(
      'CASE WHEN SUM(ga.users) = 0 THEN 0 ELSE SUM(ga.pageViews) / SUM(ga.users) END',
      'avgReadsPerUser'
    )
    // .where('ga.country = :country', { country: 'United States' })
    .andWhere('ga.date BETWEEN :startDate AND :endDate', {
      startDate,
      endDate,
    })
    .andWhere("ga.city != '(not set)'")
    .andWhere("ga.city != ''");

  if (landingPageId) {
    query.andWhere('ga.landingPageId = :landingPageId', { landingPageId });
  }

  const result = await query.groupBy('ga.city').getRawMany();
  const data = result
    ?.sort((a, b) => b.activeUsers - a.activeUsers)
    ?.filter((item) => item.activeUsers != 0)
    ?.map((item, idx) => ({
      rank: idx + 1,
      city: item.city,
      users: item.activeUsers,
      averageReads: item.avgReadsPerUser,
      duration: item.duration,
    }))
    ?.slice(0, 25);
  return data || [];
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

async fetchHeatmapData(landingPageId: number, startDate: string, endDate: string) {
  const query = this.repository.createQueryBuilder('metrics')
    .select([
      'metrics.city as city',
      'SUM(metrics.sessions) as sessions',
      'metrics.latitude as latitude',
      'metrics.longitude as longitude',
      'metrics.country as country',
      'metrics.state as state'
    ])
    .where('metrics.date BETWEEN :startDate AND :endDate', {
      startDate,
      endDate,
    })
    .andWhere("metrics.city != '(not set)'")
    .andWhere("metrics.city != ''");

  if (landingPageId) {
    query.andWhere('metrics.landingPageId = :landingPageId', { landingPageId });
  }

  query
    .groupBy('metrics.city, metrics.latitude, metrics.longitude, metrics.country, metrics.state')
    .orderBy('SUM(metrics.sessions)', 'DESC');

  return await query.getRawMany();
}

}
