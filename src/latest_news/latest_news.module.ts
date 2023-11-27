import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LatestNews } from './entities/latest_news.entity';
import { LatestNewsRepository } from './repositories/latest_news.repository';
import { LatestNewsService } from './services/latest_news.service';
import { LatestNewsController } from './controllers/latest_news.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LatestNews])],
  providers: [LatestNewsService, LatestNewsRepository],
  controllers: [LatestNewsController],
  exports: [LatestNewsService],
})
export class LatestNewsModule {}
