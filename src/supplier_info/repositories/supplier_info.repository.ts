import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { SupplierInfo } from '../entities/supplier_info.entity';

@Injectable()
export class SupplierInfoRepository extends Repository<SupplierInfo> {
  constructor(private dataSource: DataSource) {
    super(SupplierInfo, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<SupplierInfo> {
    const info = await this.findOne({ where: { id } });
    if (!info) {
      throw new NotFoundException();
    }

    return info;
  }
}
