import { Controller } from '@nestjs/common';
import { NewsletterRepository } from '../repositories/newsletter.repository';
import { NewsletterService } from '../services/newsletter.service';

@Controller({
  version: '1',
  path: 'newsletter',
})
export class NewsletterController {
  constructor(
    private repository: NewsletterRepository,
    private service: NewsletterService,
  ) {}
}
