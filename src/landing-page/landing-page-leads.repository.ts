import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LandingPageLeads } from './landing-page-leads.entity';

@Injectable()
export class LandingPageLeadsRepository extends Repository<LandingPageLeads> {
  constructor(private dataSource: DataSource) {
    super(LandingPageLeads, dataSource.createEntityManager());
  }
}