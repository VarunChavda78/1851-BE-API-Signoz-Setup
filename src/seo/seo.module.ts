import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Seo } from './seo.entity';
import { SeoService } from './seo.service';
import { SeoKeywordRepository, SeoRepository } from './seo.repository';
import { SeoKeyword } from './seoKeyword.entity';
import { SeoType } from './seoType.entity';
import { SeoController } from './seo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Seo, SeoKeyword, SeoType])],
  providers: [SeoService, ConfigService, SeoRepository, SeoKeywordRepository],
  controllers: [SeoController],
  exports: [SeoService],
})
export class SeoModule {}
