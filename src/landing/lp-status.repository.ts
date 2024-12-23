import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LpStatus } from './lp-status.entity';

@Injectable()
export class LpStatusRepository extends Repository<LpStatus> {
  constructor(private dataSource: DataSource) {
    super(LpStatus, dataSource.createEntityManager());
  }
}
