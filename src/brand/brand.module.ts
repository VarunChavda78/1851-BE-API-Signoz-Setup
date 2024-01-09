import { Module } from '@nestjs/common';
import { BrandService } from './services/brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { BrandRepository } from './repositories/brand.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  providers: [BrandService, BrandRepository, ConfigService],
  controllers: [BrandController],
  exports: [BrandService],
})
export class BrandModule {}
