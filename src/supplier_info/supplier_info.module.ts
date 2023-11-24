import { Module } from '@nestjs/common';
import { SupplierInfoService } from './services/supplier_info.service';
import { SupplierInfoController } from './controllers/supplier_info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierInfo } from './entities/supplier_info.entity';
import { SupplierInfoRepository } from './repositories/supplier_info.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierInfo])],
  providers: [SupplierInfoService, SupplierInfoRepository],
  controllers: [SupplierInfoController],
  exports: [SupplierInfoService],
})
export class SupplierInfoModule {}
