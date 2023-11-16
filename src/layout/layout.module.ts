import { Module } from '@nestjs/common';
import { LayoutService } from './services/layout.service';
import { LayoutController } from './controllers/layout.controller';
import { ConfigService } from '@nestjs/config';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { CategoryRepository } from 'src/category/repositories/category.repository';

@Module({
  imports: [],
  providers: [
    LayoutService,
    ConfigService,
    SupplierRepository,
    CategoryRepository,
  ],
  controllers: [LayoutController],
  exports: [LayoutService],
})
export class LayoutModule {}
