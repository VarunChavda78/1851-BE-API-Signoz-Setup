import { Controller, Get } from '@nestjs/common';
import { SupplierService } from '../services/supplier.service';
import { SupplierRepository } from '../repositories/supplier.repository';

@Controller('supplier')
export class SupplierController {
  constructor(
    private supplierService: SupplierService,
    private supplierRepository: SupplierRepository,
  ) {}

  @Get()
  async getSuppliers() {
    const suppliers = await this.supplierRepository.getAll();
    const data = await this.supplierService.getDetails(suppliers);
    return { data: data };
  }
}
