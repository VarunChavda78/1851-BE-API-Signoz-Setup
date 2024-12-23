import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LpSection } from './lp-section.entity';

@Injectable()
export class LpSectionRepository extends Repository<LpSection> {
  constructor(private dataSource: DataSource) {
    super(LpSection, dataSource.createEntityManager());
  }
}
