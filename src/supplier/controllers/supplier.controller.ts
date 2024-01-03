import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { SupplierService } from '../services/supplier.service';
import { SupplierRepository } from '../repositories/supplier.repository';
import { FilterDto, supplierDto } from '../dtos/supplierDto';
import * as lodash from 'lodash';
import { PageOptionsDto } from '../dtos/pageOptionsDto';
import { UserStatus } from 'src/user/dtos/UserDto';

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
  async list(
    @Query() filterData: FilterDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.supplierService.getSupplierLists(
      filterData,
      pageOptionsDto,
    );
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    const supplier = await this.supplierRepository
      .createQueryBuilder('suppliers')
      .leftJoinAndSelect('suppliers.user_id', 'user_id')
      .where('suppliers.id = :id', { id })
      .andWhere('user_id.status = :status', { status: UserStatus.APPROVED })
      .getOne();
    if (!supplier) {
      throw new NotFoundException();
    } else {
      const data = await this.supplierService.getDetails(supplier);
      return { data: data };
    }
  }

  @Post()
  async create(@Body() request: supplierDto) {
    const data = {
      ...request,
      slug: lodash.kebabCase(request?.name),
      category_id: Number(request?.category_id),
      is_featured: Boolean(request?.is_featured),
      founded: request?.founded,
      created_by: request?.created_by ?? null,
    };
    await this.supplierRepository.save(data);
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
