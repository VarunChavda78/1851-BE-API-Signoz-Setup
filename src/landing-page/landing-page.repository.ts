import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LandingPage } from './landing-page.entity';

@Injectable()
export class LandingPageRepository extends Repository<LandingPage> {
  constructor(private dataSource: DataSource) {
    super(LandingPage, dataSource.createEntityManager());
  }
}
