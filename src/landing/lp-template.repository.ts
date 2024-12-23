import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LpTemplate } from './lp-template.entity';

@Injectable()
export class LpTemplateRepository extends Repository<LpTemplate> {
  constructor(private dataSource: DataSource) {
    super(LpTemplate, dataSource.createEntityManager());
  }
}
