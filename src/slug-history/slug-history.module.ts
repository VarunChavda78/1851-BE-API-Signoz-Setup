import { Module } from '@nestjs/common';
import { SlugHistoryController } from './slug-history.controller';
import { SlugHistoryService } from './services/slug-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlugHistory } from './slug-history.entity';
import { SlugHistoryRepository } from './repositories/slug-history.repository';
import { ConfigService } from 'aws-sdk';

@Module({
  imports: [TypeOrmModule.forFeature([SlugHistory])],
  controllers: [SlugHistoryController],
  providers: [SlugHistoryService, SlugHistoryRepository, ConfigService],
  exports: [SlugHistoryService]
})
export class SlugHistoryModule {}
