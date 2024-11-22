import { Module } from '@nestjs/common';
import { SiteLogService } from './site-log.service';
import { SiteLogController } from './site-log.controller';
import {SiteLog} from '../mysqldb/entities/site-log-entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SiteLog], 'mysqldb')],
  providers: [SiteLogService,],
  controllers: [SiteLogController]
})
export class SiteLogModule {}
