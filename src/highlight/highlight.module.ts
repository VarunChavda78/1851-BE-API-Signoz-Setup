import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Highlight } from './entities/highlight.entity';
import { HighlightService } from './services/highlight.service';
import { HighlightRepository } from './repositories/highlight.repository';
import { HighlightController } from './controllers/highlight.controller';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { SupplierInfoRepository } from 'src/supplier_info/repositories/supplier_info.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Highlight])],
  providers: [
    HighlightService,
    HighlightRepository,
    SupplierRepository,
    SupplierInfoRepository,
    ConfigService,
  ],
  controllers: [HighlightController],
  exports: [HighlightService],
})
export class HighlightModule {}
