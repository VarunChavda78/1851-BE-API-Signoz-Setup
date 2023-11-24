import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { SupplierInfoService } from '../services/supplier_info.service';
import { SupplierInfoRepository } from '../repositories/supplier_info.repository';
import { supplierInfoDto } from '../dtos/supplierInfoDto';

@Controller({
  version: '1',
  path: 'supplier',
})
export class SupplierInfoController {
  constructor(
    private service: SupplierInfoService,
    private repository: SupplierInfoRepository,
  ) {}

  @Get('info/:id')
  async show(@Param('id') id: number) {
    const info = await this.repository.getById(id);
    const data = await this.service.getDetails(info);
    return { data: data };
  }

  @Post('info')
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
