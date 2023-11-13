import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService, CategoryRepository],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
