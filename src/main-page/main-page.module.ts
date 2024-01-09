import { Module } from '@nestjs/common';
import { MainPageService } from './main-page.service';
import { MainPageController } from './main-page.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [MainPageService, ConfigService],
  controllers: [MainPageController],
  exports: [MainPageService],
})
export class MainPageModule {}
