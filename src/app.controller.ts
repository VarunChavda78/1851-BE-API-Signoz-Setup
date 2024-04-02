import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RollbarLogger } from 'nestjs-rollbar';

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
    return this.appService.getHello();
  }
}
