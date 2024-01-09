import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Brand } from '../brand.entity';

@Injectable()
export class BrandRepository extends Repository<Brand> {
  constructor(private dataSource: DataSource) {
    super(Brand, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Brand> {
    const brand = await this.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException();
    }
    return brand;
  }
}
