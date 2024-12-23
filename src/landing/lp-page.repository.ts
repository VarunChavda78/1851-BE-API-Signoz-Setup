import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LpPage } from './lp-page.entity';

@Injectable()
export class LpPageRepository extends Repository<LpPage> {
  constructor(private dataSource: DataSource) {
    super(LpPage, dataSource.createEntityManager());
  }
}
