import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LatestNews } from './entities/latest_news.entity';
import { LatestNewsRepository } from './repositories/latest_news.repository';
import { LatestNewsService } from './services/latest_news.service';
import { LatestNewsController } from './controllers/latest_news.controller';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([LatestNews]), HttpModule],
  providers: [LatestNewsService, LatestNewsRepository, SupplierRepository],
  controllers: [LatestNewsController],
  exports: [LatestNewsService],
})
export class LatestNewsModule {}
