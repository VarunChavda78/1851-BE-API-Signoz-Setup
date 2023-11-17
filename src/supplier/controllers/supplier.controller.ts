import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { SupplierService } from '../services/supplier.service';
import { SupplierRepository } from '../repositories/supplier.repository';
import { FilterDto, supplierDto } from '../dtos/supplierDto';
import { Supplier } from '../entities/supplier.entity';
import * as lodash from 'lodash';

@Controller({
  version: '1',
  path: 'supplier',
})
export class SupplierController {
  constructor(
    private supplierService: SupplierService,
    private supplierRepository: SupplierRepository,
  ) {}

  @Get()
  async list(@Query() filterData: FilterDto) {
    const suppliers =
      await this.supplierRepository.findAllWithFilter(filterData);
    const data = await this.supplierService.getData(suppliers);
    return { data: data };
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    const supplier = await this.supplierRepository.getById(id);
    const data = await this.supplierService.getDetails(supplier);
    return { data: data };
  }

  @Post()
  async create(@Body() request: supplierDto) {
    const supplier = new Supplier();
    supplier.name = request?.name;
    supplier.slug = lodash.kebabCase(request?.name);
    supplier.location = request?.location;
    supplier.description = request?.description;
    supplier.categoryId = Number(request?.categoryId);
    supplier.isFeatured = request?.isFeatured;
    supplier.founded = Number(request?.founded);
    supplier.videoUrl = request?.videoUrl;
    supplier.createdBy = request?.createdBy ?? null;
    await this.supplierRepository.save(supplier);
    return {
      statusCode: HttpStatus.CREATED,
      status: 'Supplier created successfully',
    };
  }

  @Post(':id')
  async update(@Param('id') id: number, @Body() request: supplierDto) {
    const isExist = await this.supplierRepository.getById(id);
    if (isExist) {
      const data: any = {
        ...request,
        slug: lodash.kebabCase(request?.name),
      };
      await this.supplierRepository.update({ id }, data);
      return {
        statusCode: HttpStatus.CREATED,
        status: 'Supplier updated successfully',
      };
    }
  }
}
