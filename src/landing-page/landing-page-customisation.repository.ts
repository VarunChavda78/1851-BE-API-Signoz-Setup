import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LandingPageCustomisation } from './landing-page-customisation.entity';

@Injectable()
export class LandingPageCustomisationRepository extends Repository<LandingPageCustomisation> {
  constructor(private dataSource: DataSource) {
    super(LandingPageCustomisation, dataSource.createEntityManager());
  }
}
