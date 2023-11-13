import { Controller, Get } from '@nestjs/common';
import { LayoutService } from '../services/layout.service';

@Controller({
  version: '1',
})
export class LayoutController {
  constructor(private layoutService: LayoutService) {}

  @Get('top-header')
  async getTopHeader() {
    const data = await this.layoutService.getheader();
    return { data: data };
  }
}
