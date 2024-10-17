import { Controller, Get } from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller({
  version: '1',
  path: 'faq',
})
export class FaqController {
  constructor(private readonly faqService: FaqService) {}
  
  @Get()
  hello() {
    return this.faqService.hello();
  }
}
