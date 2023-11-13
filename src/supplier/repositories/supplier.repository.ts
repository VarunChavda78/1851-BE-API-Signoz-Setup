import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Supplier } from '../entities/supplier.entity';

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

  async getAll(): Promise<Supplier[]> {
    const suppliers = await this.find();
    if (!suppliers.length) {
      throw new NotFoundException();
    }
    return suppliers;
  }
}
