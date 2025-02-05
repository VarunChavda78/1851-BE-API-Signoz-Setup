import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LpLeads } from './lp-leads.entity';

@Injectable()
export class LpLeadsRepository extends Repository<LpLeads> {
  constructor(private dataSource: DataSource) {
    super(LpLeads, dataSource.createEntityManager());
  }
}
