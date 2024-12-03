import { Module } from '@nestjs/common';
import { SiteLogService } from './site-log.service';
import { SiteLogController } from './site-log.controller';
import {SiteLog} from '../mysqldb/entities/site-log-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from '../shared/services/common.service';
import { ConfigService } from '@nestjs/config';
import { Registration } from 'src/mysqldb/entities/registration.entity';


@Module({
  imports: [TypeOrmModule.forFeature([SiteLog,Registration], 'mysqldb')],
  providers: [SiteLogService,CommonService,ConfigService],
  controllers: [SiteLogController]
})
export class SiteLogModule {}
