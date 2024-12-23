import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LpDomainHistory } from './lp-domain-history.entity';

@Injectable()
export class LpDomainHistoryRepository extends Repository<LpDomainHistory> {
  constructor(private dataSource: DataSource) {
    super(LpDomainHistory, dataSource.createEntityManager());
  }
}
