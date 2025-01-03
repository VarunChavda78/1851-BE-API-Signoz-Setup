import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LpSettings } from './lp-settings.entity';

@Injectable()
export class LpSettingsRepository extends Repository<LpSettings> {
  constructor(private dataSource: DataSource) {
    super(LpSettings, dataSource.createEntityManager());
  }
}
