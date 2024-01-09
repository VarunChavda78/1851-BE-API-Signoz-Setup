import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AnalyticDomains } from '../analytic-domains.entity';

@Injectable()
export class AnalyticDomainsRepository extends Repository<AnalyticDomains> {
  constructor(private dataSource: DataSource) {
    super(AnalyticDomains, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<AnalyticDomains> {
    const analytic = await this.findOne({ where: { id } });
    if (!analytic) {
      throw new NotFoundException();
    }
    return analytic;
  }
}
