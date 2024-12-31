import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LpPdf } from './lp-pdf.entity';

@Injectable()
export class LpPdfRepository extends Repository<LpPdf> {
  constructor(private dataSource: DataSource) {
    super(LpPdf, dataSource.createEntityManager());
  }
}
