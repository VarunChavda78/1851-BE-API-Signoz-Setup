import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { SupplierService } from './services/supplier.service';
import { SupplierRepository } from './repositories/supplier.repository';
import { FilterDto } from './dtos/supplierDto';
import { PageOptionsDto } from './dtos/pageOptionsDto';
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
    return await this.supplierService.getLists(filterData, pageOptionsDto);
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    const supplier = await this.supplierRepository
      .createQueryBuilder('suppliers')
      .leftJoinAndSelect('suppliers.user', 'user')
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
}
