import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SupplierLibrary } from '../supplier-library.entity';

@Injectable()
export class SupplierLibraryRepository extends Repository<SupplierLibrary> {
  constructor(private dataSource: DataSource) {
    super(SupplierLibrary, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<SupplierLibrary> {
    const library = await this.findOne({ where: { id } });
    if (!library) {
      throw new NotFoundException();
    }
    return library;
  }
}
