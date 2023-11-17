import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Supplier } from '../entities/supplier.entity';
import { FilterDto } from '../dtos/supplierDto';

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

  async findAllWithFilter(filterData: FilterDto): Promise<Supplier[]> {
    let { page, limit } = filterData;
    page = page ?? 1;
    limit = limit ?? 10;
    const { featured, category } = filterData;
    const skip = (page - 1) * limit;
    const queryBuilder = this.createQueryBuilder('suppliers');
    if (featured) {
      const isFeatured = Boolean(featured);
      queryBuilder.andWhere('suppliers.isFeatured = :isFeatured', {
        isFeatured,
      });
    }
    if (category) {
      const categoryId = await this.transformStringToArray(category);
      queryBuilder.andWhere('suppliers.categoryId IN (:...categoryId)', {
        categoryId,
      });
    }
    const suppliers = await queryBuilder.skip(skip).take(limit).getMany();
    if (!suppliers.length) {
      throw new NotFoundException();
    }
    return suppliers;
  }

  transformStringToArray(inputString: string): number[] {
    const stringArray = inputString.split(','); // Split the string into an array using ',' as the delimiter
    const numberArray = stringArray.map(Number); // Convert each element to a number

    return numberArray;
  }
}
