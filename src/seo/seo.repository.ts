import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Seo } from './seo.entity';
import { SeoKeyword } from './seoKeyword.entity';

@Injectable()
export class SeoRepository extends Repository<Seo> {
  constructor(private dataSource: DataSource) {
    super(Seo, dataSource.createEntityManager());
  }
}

@Injectable()
export class SeoKeywordRepository extends Repository<SeoKeyword> {
  constructor(private dataSource: DataSource) {
    super(SeoKeyword, dataSource.createEntityManager());
  }
}
