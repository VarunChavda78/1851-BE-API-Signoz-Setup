import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';

@Module({
  imports: [SharedModule, LayoutModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
