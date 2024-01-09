import { Controller, Get, Query } from '@nestjs/common';
import { HighlightService } from './services/highlight.service';
import { HighlightDto } from './dtos/highlightDto';

@Controller({
  version: '1',
  path: 'highlight',
})
export class HighlightController {
  constructor(private service: HighlightService) {}

  @Get()
  async list(@Query() filter: HighlightDto) {
    return await this.service.getHighlightList(filter);
  }
}
