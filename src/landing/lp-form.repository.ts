import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LpForm } from './lp-form.entity';

@Injectable()
export class LpCrmFormRepository extends Repository<LpForm> {
  constructor(private dataSource: DataSource) {
    super(LpForm, dataSource.createEntityManager());
  }
}
