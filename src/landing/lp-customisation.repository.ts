import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LpCustomisation } from './lp-customisation.entity';

@Injectable()
export class LpCustomisationRepository extends Repository<LpCustomisation> {
  constructor(private dataSource: DataSource) {
    super(LpCustomisation, dataSource.createEntityManager());
  }
}
