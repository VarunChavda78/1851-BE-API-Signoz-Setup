import { Controller } from '@nestjs/common';
import { SupplierLibraryRepository } from '../repositories/supplier_library.repository';
import { SupplierLibraryService } from '../services/supplier_library.service';

@Controller({
  version: '1',
  path: 'supplier-library',
})
export class SupplierLibraryController {
  constructor(
    private repository: SupplierLibraryRepository,
    private service: SupplierLibraryService,
  ) {}
}
