import { Controller, Get } from '@nestjs/common';
import { CommonService } from './common.service';

@Controller({
  version: '1',
})
export class CommonController {
  constructor(private commonService: CommonService) {}

  @Get('state')
  async state() {
    const data = await this.commonService.getStates();
    return { data: data };
  }
}
