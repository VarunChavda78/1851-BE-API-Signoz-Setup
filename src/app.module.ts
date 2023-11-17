import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { SupplierModule } from './supplier/supplier.module';
import { ReviewModule } from './review/review.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [
    SharedModule,
    LayoutModule,
    SupplierModule,
    ReviewModule,
    CategoryModule,
    BrandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
