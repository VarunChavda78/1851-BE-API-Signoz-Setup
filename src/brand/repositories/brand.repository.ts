import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Brand } from '../entities/brand.entity';
import { BrandPainationDto } from '../dtos/brandDto';

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

  async findAll(pagination: BrandPainationDto): Promise<Brand[]> {
    let { page, limit } = pagination;
    page = page ?? 1;
    limit = limit ?? 10;
    const skip = (page - 1) * limit;
    const brands = await this.find({ skip, take: limit });
    if (!brands.length) {
      throw new NotFoundException();
    }
    return brands;
  }
}
