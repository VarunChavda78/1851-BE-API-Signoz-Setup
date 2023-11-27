import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { BrandService } from '../services/brand.service';
import { BrandRepository } from '../repositories/brand.repository';
import { BrandDto } from '../dtos/brandDto';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';

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
  async list(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.brandService.getList(pageOptionsDto);
  }

  @Post()
  async create(@Body() request: BrandDto) {
    const data = {
      name: request?.name,
      slug: request?.slug,
      logo: request?.logo,
    };
    await this.brandRepository.save(data);
    return {
      statusCode: HttpStatus.CREATED,
      status: 'Brand created successfully',
    };
  }
}
