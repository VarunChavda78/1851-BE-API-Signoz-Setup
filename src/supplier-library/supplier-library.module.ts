import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierLibrary } from './supplier-library.entity';
import { SupplierLibraryService } from './services/supplier-library.service';
import { SupplierLibraryRepository } from './repositories/supplier-library.repository';
import { SupplierLibraryController } from './supplier-library.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierLibrary])],
  providers: [SupplierLibraryService, SupplierLibraryRepository, ConfigService],
  controllers: [SupplierLibraryController],
  exports: [SupplierLibraryService],
})
export class SupplierLibraryModule {}
