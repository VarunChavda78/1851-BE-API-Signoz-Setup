import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UniversityModule } from './university/university.module';
import { SharedModule } from './shared/shared.module';


@Module({
  imports: [
  UniversityModule,
  SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
