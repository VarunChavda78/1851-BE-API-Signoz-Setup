import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { LpGaSummary } from '../lp-ga-summary.entity';

@Injectable()
export class LpGaSummaryRepository {
  constructor(
    @InjectRepository(LpGaSummary)
    private repository: Repository<LpGaSummary>,
  ) {}

  async findByBrandId(
    brandId: number, 
    startDate: string, 
    endDate: string
  ): Promise<LpGaSummary[]> {
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
    endDate: string
  ): Promise<LpGaSummary[]> {
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

  async deleteByDateRange(startDate: string, endDate: string, brandId?: number, landingPageId?: number): Promise<void> {
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

  async save(data: Partial<LpGaSummary>): Promise<LpGaSummary> {
    return this.repository.save(data);
  }
}
