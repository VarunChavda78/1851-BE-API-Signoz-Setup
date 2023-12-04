import { Module } from '@nestjs/common';
import { ReviewService } from './services/review.service';
import { ReviewController } from './controllers/review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewRepository } from './repositories/review.repository';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [
    ReviewService,
    ReviewRepository,
    SupplierRepository,
    ConfigService,
  ],
  controllers: [ReviewController],
  exports: [ReviewService],
})
export class ReviewModule {}
