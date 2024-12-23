import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LpTemplatePage } from './lp-template-page.entity';

@Injectable()
export class LpTemplatePageRepository extends Repository<LpTemplatePage> {
  constructor(private dataSource: DataSource) {
    super(LpTemplatePage, dataSource.createEntityManager());
  }
}
