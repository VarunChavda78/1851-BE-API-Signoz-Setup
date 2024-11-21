import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LandingPageSection } from './landing-page-section.entity';

@Injectable()
export class LandingPageSectionRepository extends Repository<LandingPageSection> {
  constructor(private dataSource: DataSource) {
    super(LandingPageSection, dataSource.createEntityManager());
  }
}
