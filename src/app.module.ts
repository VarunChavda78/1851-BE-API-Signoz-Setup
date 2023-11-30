import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { SupplierModule } from './supplier/supplier.module';
import { ReviewModule } from './review/review.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { SupplierLibraryModule } from './supplier-library/supplier-library.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { HighlightModule } from './highlight/highlight.module';
import { SupplierInfoModule } from './supplier-info/supplier-info.module';
import { LatestNewsModule } from './latest-news/latest-news.module';

@Module({
  imports: [
    SharedModule,
    LayoutModule,
    SupplierModule,
    ReviewModule,
    CategoryModule,
    BrandModule,
    SupplierLibraryModule,
    TestimonialModule,
    NewsletterModule,
    HighlightModule,
    SupplierInfoModule,
    LatestNewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
