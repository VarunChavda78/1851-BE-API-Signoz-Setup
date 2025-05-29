import { Controller, Get } from '@nestjs/common';

@Controller({
    version: '1',
    path: 'landing-analytics',
  })
export class LandingAnalyticsController {
    constructor(){}

    @Get()
    hello(){
        return 'Hello landing analytics'
    }
}
