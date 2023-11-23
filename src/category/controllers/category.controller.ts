import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../entities/category.entity';
import { categoryDto } from '../dtos/categoryDto';

@Controller({
  version: '1',
  path: 'category',
})
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private categoryRepository: CategoryRepository,
  ) {}

  @Get()
  async list() {
    const categories = await this.categoryRepository.find();
    const data = await this.categoryService.getDetails(categories);
    return { data: data };
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    const category: Category = await this.categoryRepository.getById(id);
    const data = {
      id: category.id,
      name: category.name,
    };
    return { data: data };
  }

  @Post()
  async create(@Body() request: categoryDto) {
    const category = new Category();
    category.name = request?.name;
    await this.categoryRepository.save(category);
    return {
      statusCode: HttpStatus.CREATED,
      status: 'Category created successfully',
    };
  }

  @Post(':id')
  async update(@Param('id') id: number, @Body() request: categoryDto) {
    const isExist = await this.categoryRepository.getById(id);
    if (isExist) {
      await this.categoryRepository.update({ id }, { name: request?.name });
      return {
        statusCode: HttpStatus.CREATED,
        status: 'Category updated successfully',
      };
    }
  }
}
