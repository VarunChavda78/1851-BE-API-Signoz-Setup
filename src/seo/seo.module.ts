import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Seo, SeoKeyword, SeoType } from './seo.entity';
import { SeoService } from './seo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seo, SeoKeyword, SeoType])],
  providers: [SeoService, ConfigService],
  controllers: [],
  exports: [SeoService],
})
export class SeoModule {}
