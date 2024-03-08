import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { UniversityModule } from './university/university.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
  HelloWorldModule,
  UniversityModule,
  SharedModule,
  ConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
