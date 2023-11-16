import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Supplier } from '../entities/supplier.entity';
import { PaginationDto } from '../dtos/supplierDto';

@Injectable()
export class SupplierRepository extends Repository<Supplier> {
  constructor(private dataSource: DataSource) {
    super(Supplier, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Supplier> {
    const supplier = await this.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException();
    }

    return supplier;
  }

  async findAll(paginationDto: PaginationDto): Promise<Supplier[]> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    const suppliers = await this.find({
      skip,
      take: limit,
    });
    if (!suppliers.length) {
      throw new NotFoundException();
    }
    return suppliers;
  }
}
