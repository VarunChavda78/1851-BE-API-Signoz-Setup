import { Controller, Get, Query } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { LayoutDto } from './dtos/layoutDto';

@Controller({
  version: '1',
})
export class LayoutController {
  constructor(private layoutService: LayoutService) {}

  @Get('top-header')
  async getTopHeader(@Query() params: LayoutDto) {
    const data = await this.layoutService.getheader(params?.slug);
    return { data: data };
  }

  @Get('footer')
  async footer(@Query() params: LayoutDto) {
    const data = await this.layoutService.getFooter(params?.slug);
    return { data: data };
  }
}
