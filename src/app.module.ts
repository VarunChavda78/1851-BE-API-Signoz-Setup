import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [SharedModule, LayoutModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
