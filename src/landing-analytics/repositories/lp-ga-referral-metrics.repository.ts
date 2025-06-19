import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { LpGaReferralMetrics } from '../lp-ga-referral-metrics.entity';

@Injectable()
export class LpGaReferralMetricsRepository {
  constructor(
    @InjectRepository(LpGaReferralMetrics)
    private repository: Repository<LpGaReferralMetrics>,
  ) {}

  async save(data: Partial<LpGaReferralMetrics>): Promise<LpGaReferralMetrics> {
    return this.repository.save(data);
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

  async fetchReferralMetrics(
    landingPageId: number,
    startDate: string,
    endDate: string,
    sort: string = 'sessions',
    order: 'asc' | 'desc' = 'desc',
    limit: number = 5,
    page: number = 1,
  ) {
    const qb = this.repository.createQueryBuilder('ga')
      .select('ga.source', 'source')
      .addSelect('SUM(ga.sessions)', 'sessions')
      .where('ga.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere("ga.source != ''")
      .andWhere("ga.source != '(not set)'");
    if (landingPageId) {
      qb.andWhere('ga.landingPageId = :landingPageId', { landingPageId });
    }
    qb.groupBy('ga.source');
    // Sorting
    if (sort === 'source') {
      qb.orderBy('source', order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      qb.orderBy('sessions', order.toUpperCase() as 'ASC' | 'DESC');
    }
    // Pagination
    const countQb = this.repository.createQueryBuilder('ga')
      .select('COUNT(DISTINCT ga.source)', 'count')
      .where('ga.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere("ga.source != ''")
      .andWhere("ga.source != '(not set)'");
    if (landingPageId) {
      countQb.andWhere('ga.landingPageId = :landingPageId', { landingPageId });
    }
    const totalRecordsResult = await countQb.getRawOne();
    const totalRecords = Number(totalRecordsResult.count);
    qb.limit(limit).offset((page - 1) * limit);
    const data = await qb.getRawMany();
    return { data, totalRecords };
  }
} 