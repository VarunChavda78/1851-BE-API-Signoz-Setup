import { Module } from '@nestjs/common';
import { SupplierService } from './services/supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { SupplierRepository } from './repositories/supplier.repository';
import { CategoryRepository } from 'src/category/repositories/category.repository';
import { ConfigService } from '@nestjs/config';
import { SlugHistoryRepository } from 'src/slug-history/repositories/slug-history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  providers: [
    SupplierService,
    SupplierRepository,
    CategoryRepository,
    SlugHistoryRepository,
    ConfigService,
  ],
  controllers: [SupplierController],
  exports: [SupplierService],
})
export class SupplierModule {}
