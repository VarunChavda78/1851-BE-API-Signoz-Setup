import { Module } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { LayoutController } from './layout.controller';
import { ConfigService } from '@nestjs/config';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';

@Module({
  imports: [],
  providers: [LayoutService, ConfigService, SupplierRepository],
  controllers: [LayoutController],
  exports: [LayoutService],
})
export class LayoutModule {}
