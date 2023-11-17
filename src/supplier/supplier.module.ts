import { Module } from '@nestjs/common';
import { SupplierService } from './services/supplier.service';
import { SupplierController } from './controllers/supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierRepository } from './repositories/supplier.repository';
import { CategoryRepository } from 'src/category/repositories/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  providers: [SupplierService, SupplierRepository, CategoryRepository],
  controllers: [SupplierController],
  exports: [SupplierService],
})
export class SupplierModule {}
