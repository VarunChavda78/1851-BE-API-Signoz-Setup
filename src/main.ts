import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import tracer from './tracer';
import logger from './logger';

async function bootstrap() {
  await tracer.start();
  
  const app = await NestFactory.create(AppModule);

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Increase payload size limit
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Log application startup
  logger.info('Application starting up', { 
    port: 3000, 
    environment: process.env.NODE_ENV || 'development' 
  });

  await app.listen(3000);
  
  logger.info('Application started successfully', { port: 3000 });
}
bootstrap();
