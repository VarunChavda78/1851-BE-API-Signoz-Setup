import { Module } from '@nestjs/common';
import { SupplierInfoService } from './services/supplier-info.service';
import { SupplierInfoController } from './controllers/supplier-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierInfo } from './entities/supplier-info.entity';
import { SupplierInfoRepository } from './repositories/supplier-info.repository';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { ConfigService } from '@nestjs/config';
import { LayoutService } from 'src/layout/services/layout.service';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierInfo])],
  providers: [
    SupplierInfoService,
    SupplierInfoRepository,
    SupplierRepository,
    MediaRepository,
    ConfigService,
    LayoutService,
  ],
  controllers: [SupplierInfoController],
  exports: [SupplierInfoService],
})
export class SupplierInfoModule {}
