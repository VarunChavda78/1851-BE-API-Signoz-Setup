import { Module } from '@nestjs/common';
import { LayoutService } from './services/layout.service';
import { LayoutController } from './controllers/layout.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [LayoutService, ConfigService],
  controllers: [LayoutController],
  exports: [LayoutService],
})
export class LayoutModule {}
