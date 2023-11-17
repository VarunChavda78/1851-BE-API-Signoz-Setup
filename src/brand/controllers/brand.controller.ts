import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { BrandService } from '../services/brand.service';
import { BrandRepository } from '../repositories/brand.repository';
import { BrandDto, BrandPainationDto } from '../dtos/brandDto';
import { Brand } from '../entities/brand.entity';

@Controller({
  version: '1',
  path: 'brand',
})
export class BrandController {
  constructor(
    private brandService: BrandService,
    private brandRepository: BrandRepository,
  ) {}

  @Get()
  async list(@Query() pagination: BrandPainationDto) {
    const categories = await this.brandRepository.findAll(pagination);
    const data = await this.brandService.getDetails(categories);
    return { data: data };
  }

  @Post()
  async create(@Body() request: BrandDto) {
    const category = new Brand();
    category.name = request?.name;
    category.logo = request?.logo;
    category.url = request?.url;
    await this.brandRepository.save(category);
    return {
      statusCode: HttpStatus.CREATED,
      status: 'Brand created successfully',
    };
  }
}
