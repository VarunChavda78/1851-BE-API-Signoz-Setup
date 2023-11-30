import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierLibrary } from './entities/supplier-library.entity';
import { SupplierLibraryService } from './services/supplier-library.service';
import { SupplierLibraryRepository } from './repositories/supplier-library.repository';
import { SupplierLibraryController } from './controllers/supplier-library.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierLibrary])],
  providers: [SupplierLibraryService, SupplierLibraryRepository],
  controllers: [SupplierLibraryController],
  exports: [SupplierLibraryService],
})
export class SupplierLibraryModule {}
