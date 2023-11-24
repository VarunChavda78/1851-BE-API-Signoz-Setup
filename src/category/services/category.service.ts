import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private repository: CategoryRepository) {}

  async getDetails(categories) {
    const data = [];
    if (categories.length) {
      for (const category of categories) {
        data.push({
          value: category.id,
          label: category.name,
        });
      }
    }
    return data;
  }
}
