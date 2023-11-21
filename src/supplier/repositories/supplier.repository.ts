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

  transformStringToArray(inputString: string): number[] {
    const stringArray = inputString.split(','); // Split the string into an array using ',' as the delimiter
    const numberArray = stringArray.map(Number); // Convert each element to a number

    return numberArray;
  }
}
