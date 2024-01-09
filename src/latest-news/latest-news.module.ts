import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LatestNews } from './latest-news.entity';
import { LatestNewsRepository } from './repositories/latest-news.repository';
import { LatestNewsService } from './services/latest-news.service';
import { LatestNewsController } from './latest-news.controller';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { SupplierInfoRepository } from 'src/supplier-info/repositories/supplier-info.repository';
import { ConfigService } from '@nestjs/config';
import { CommonService } from 'src/shared/services/common.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([LatestNews]), HttpModule],
  providers: [
    LatestNewsService,
    LatestNewsRepository,
    SupplierRepository,
    SupplierInfoRepository,
    ConfigService,
    CommonService,
  ],
  controllers: [LatestNewsController],
  exports: [LatestNewsService],
})
export class LatestNewsModule {}
