import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LandingPagePublish } from './landing-page-publish.entity'; // Create or update this entity

@Injectable()
export class LandingPagePublishRepository extends Repository<LandingPagePublish> {
  constructor(private dataSource: DataSource) {
    super(LandingPagePublish, dataSource.createEntityManager());
  }
}
