import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../entities/category.entity';

@Controller({
  version: '1',
  path: 'category',
})
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private categoryRepository: CategoryRepository,
  ) {}

  @Get('list')
  async categoryList() {
    const categories = await this.categoryRepository.getAll();
    const data = await this.categoryService.getDetails(categories);
    return { data: data };
  }

  @Get(':id')
  async category(@Param('id') id: number) {
    const category: Category = await this.categoryRepository.getById(id);
    const data = {
      id: category.id,
      name: category.name,
    };
    return { data: data };
  }
}
