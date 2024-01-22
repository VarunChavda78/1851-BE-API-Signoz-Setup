import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigin = 'https://1851dev.com';
  app.use(
    cors({
      origin: allowedOrigin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(3000);
}
bootstrap();
