import { Module } from '@nestjs/common';
import { SupplierInfoService } from './services/supplier-info.service';
import { SupplierInfoController } from './controllers/supplier-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierInfo } from './entities/supplier-info.entity';
import { SupplierInfoRepository } from './repositories/supplier-info.repository';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { ConfigService } from '@nestjs/config';
import { LatestNewsRepository } from 'src/latest-news/repositories/latest-news.repository';
import { HighlightRepository } from 'src/highlight/repositories/highlight.repository';
import { CategoryRepository } from 'src/category/repositories/category.repository';
import { CommonService } from 'src/shared/services/common.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierInfo]), HttpModule],
  providers: [
    SupplierInfoService,
    SupplierInfoRepository,
    SupplierRepository,
    MediaRepository,
    ConfigService,
    LatestNewsRepository,
    HighlightRepository,
    CategoryRepository,
    CommonService,
  ],
  controllers: [SupplierInfoController],
  exports: [SupplierInfoService],
})
export class SupplierInfoModule {}
