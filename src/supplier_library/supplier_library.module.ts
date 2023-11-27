import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierLibrary } from './entities/supplier_library.entity';
import { SupplierLibraryService } from './services/supplier_library.service';
import { SupplierLibraryRepository } from './repositories/supplier_library.repository';
import { SupplierLibraryController } from './controllers/supplier_library.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierLibrary])],
  providers: [SupplierLibraryService, SupplierLibraryRepository],
  controllers: [SupplierLibraryController],
  exports: [SupplierLibraryService],
})
export class SupplierLibraryModule {}
