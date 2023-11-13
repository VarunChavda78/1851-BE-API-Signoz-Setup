import { Controller, Get, Param } from '@nestjs/common';
import { SupplierService } from '../services/supplier.service';
import { SupplierRepository } from '../repositories/supplier.repository';

@Controller('supplier')
export class SupplierController {
  constructor(
    private supplierService: SupplierService,
    private supplierRepository: SupplierRepository,
  ) {}

  @Get('list')
  async getSuppliersList() {
    const suppliers = await this.supplierRepository.getAll();
    const data = await this.supplierService.getDetails(suppliers);
    return { data: data };
  }

  @Get(':id')
  async getSupplier(@Param('id') id: number) {
    const supplier = await this.supplierRepository.getById(id);
    const data = await this.supplierService.getDetails(supplier);
    return { data: data };
  }
}
