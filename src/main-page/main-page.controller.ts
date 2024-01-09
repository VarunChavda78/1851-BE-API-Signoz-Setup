import { Controller, Get } from '@nestjs/common';
import { MainPageService } from './main-page.service';

@Controller({
  version: '1',
})
export class MainPageController {
  constructor(private mainPageService: MainPageService) {}

  @Get('benefits')
  async benefits() {
    const data = await this.mainPageService.benefits();
    return data;
  }
}
