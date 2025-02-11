import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LpInquiry } from './lp-inquiry.entity';

@Injectable()
export class LpInquiryRepository extends Repository<LpInquiry> {
  constructor(private dataSource: DataSource) {
    super(LpInquiry, dataSource.createEntityManager());
  }
}
