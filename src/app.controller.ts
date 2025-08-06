import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RollbarLogger } from 'nestjs-rollbar';
import logger from './logger';

@Controller({
  version: '1',
})
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rollbarLogger: RollbarLogger,
    ) {}

  @Get()
  getHello(): string {
    this.rollbarLogger.log("Hello World")
    
    // Add structured logging with Winston
    logger.info('Hello endpoint called', {
      endpoint: '/',
      method: 'GET',
      timestamp: new Date().toISOString()
    });
    
    return this.appService.getHello();
  }
}
