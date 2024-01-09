import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Category } from '../category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Category> {
    const category = await this.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException();
    }
    return category;
  }

  async getAll(): Promise<Category[]> {
    const categories = await this.find();
    if (!categories.length) {
      throw new NotFoundException();
    }
    return categories;
  }
}
