import { Module } from '@nestjs/common';
import { LayoutService } from './services/layout.service';
import { LayoutController } from './controllers/layout.controller';
import { ConfigService } from '@nestjs/config';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { CategoryRepository } from 'src/category/repositories/category.repository';
import { HighlightRepository } from 'src/highlight/repositories/highlight.repository';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { SupplierInfoRepository } from 'src/supplier_info/repositories/supplier_info.repository';

@Module({
  imports: [],
  providers: [
    LayoutService,
    ConfigService,
    SupplierRepository,
    CategoryRepository,
    HighlightRepository,
    MediaRepository,
    SupplierInfoRepository,
  ],
  controllers: [LayoutController],
  exports: [LayoutService],
})
export class LayoutModule {}
