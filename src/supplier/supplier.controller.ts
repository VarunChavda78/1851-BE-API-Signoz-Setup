import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { SupplierService } from './services/supplier.service';
import { SupplierRepository } from './repositories/supplier.repository';
import { FilterDto } from './dtos/supplierDto';
import { PageOptionsDto } from './dtos/pageOptionsDto';
import { UserStatus } from 'src/user/dtos/UserDto';
import { SlugHistoryRepository } from 'src/slug-history/repositories/slug-history.repository';

@Controller({
  version: '1',
  path: 'supplier',
})
export class SupplierController {
  constructor(
    private supplierService: SupplierService,
    private supplierRepository: SupplierRepository,
    private slugHistory: SlugHistoryRepository,
  ) {}

  @Get()
  async list(
    @Query() filterData: FilterDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.supplierService.getLists(filterData, pageOptionsDto);
  }
  
  @Get('validate')
  async validate(@Query('slug') slug: string) {
    let data = {
      isValid: false,
      slug: '',
      slugs: []
    };

    let supplier = await this.supplierRepository
      .createQueryBuilder('suppliers')
      .leftJoinAndSelect('suppliers.user', 'user')
      .where('suppliers.slug = :slug', { slug })
      .andWhere('user.status = :status', { status: UserStatus.APPROVED })
      .getOne();

    if (!supplier) {
      const supplierInSlugHistory = await this.slugHistory.getBySlug(slug);
      if (supplierInSlugHistory) {
        supplier = await this.supplierRepository
          .createQueryBuilder('suppliers')
          .leftJoinAndSelect('suppliers.user', 'user')
          .where('suppliers.id = :id', { id: supplierInSlugHistory.object_id })
          .andWhere('user.status = :status', { status: UserStatus.APPROVED })
          .getOne();
        if (supplier) {
          const slugHistory =await this.slugHistory?.getBySupplierId(supplier?.id);
          const supplierSlugHistory = slugHistory?.filter((history)=> history?.slug !== supplier?.slug)?.map((s)=>s?.slug);
          data = {
            isValid : true,
            slug : supplier?.slug,
            slugs :  [...supplierSlugHistory]
          } 
          return {
            statusCode: HttpStatus.MOVED_PERMANENTLY,
            data: data
          };
        } else {
          throw new NotFoundException('Supplier not found');
        }
      } else {
        throw new NotFoundException('Supplier not found');
      }
    }else{
      const slugHistory =await this.slugHistory?.getBySupplierId(supplier?.id);
      const supplierSlugHistory = slugHistory?.filter((history)=> history?.slug !== supplier?.slug)?.map((s)=>s?.slug);
       data = {
        isValid : true,
        slug : supplier?.slug,
        slugs :  [...supplierSlugHistory]
      } 
      return {
        statusCode: HttpStatus.OK,
        data: data
      };
    }
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
