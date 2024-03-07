import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { UniversityModule } from './university/university.module';


@Module({
  imports: [
  HelloWorldModule,
  UniversityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
