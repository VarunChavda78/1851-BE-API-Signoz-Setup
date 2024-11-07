import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [S3Service, ConfigService],
  controllers: [S3Controller],
  exports: [],
})
export class S3Module {}
