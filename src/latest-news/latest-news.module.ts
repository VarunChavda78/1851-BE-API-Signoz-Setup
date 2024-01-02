import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LatestNews } from './entities/latest-news.entity';
import { LatestNewsRepository } from './repositories/latest-news.repository';
import { LatestNewsService } from './services/latest-news.service';
import { LatestNewsController } from './controllers/latest-news.controller';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { HttpModule } from '@nestjs/axios';
import { SupplierInfoRepository } from 'src/supplier-info/repositories/supplier-info.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([LatestNews]), HttpModule],
  providers: [
    LatestNewsService,
    LatestNewsRepository,
    SupplierRepository,
    SupplierInfoRepository,
    ConfigService,
  ],
  controllers: [LatestNewsController],
  exports: [LatestNewsService],
})
export class LatestNewsModule {}
