import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule} from 'nestjs-rollbar';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UniversityModule } from './university/university.module';
import { SharedModule } from './shared/shared.module';


@Module({
  imports: [
  UniversityModule,
  SharedModule,
  LoggerModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      accessToken: configService.get('rollbar.rollbarAccessToken'),
      environment: configService.get('rollbar.rollbarEnvironment'),
      captureUncaught: true,
      captureUnhandledRejections: true,
      ignoreDuplicateErrors: false,
    }),
    inject: [ConfigService],
  }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
