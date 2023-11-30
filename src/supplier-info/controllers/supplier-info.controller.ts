import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { SupplierInfoService } from '../services/supplier-info.service';
import { SupplierInfoRepository } from '../repositories/supplier-info.repository';
import { InfoFilter, supplierInfoDto } from '../dtos/supplierInfoDto';

@Controller({
  version: '1',
  path: 'info',
})
export class SupplierInfoController {
  constructor(
    private service: SupplierInfoService,
    private repository: SupplierInfoRepository,
  ) {}

  @Get()
  async show(@Query() infoFilter: InfoFilter) {
    const data = await this.service.getInfo(infoFilter);
    return { data: data };
  }

  @Post()
  async create(@Body() request: supplierInfoDto) {
    const data = {
      ...request,
    };
    await this.repository.save(data);
    return {
      statusCode: HttpStatus.CREATED,
      status: 'Supplier Info saved successfully',
    };
  }
}
