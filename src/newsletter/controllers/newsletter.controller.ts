import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { NewsletterRepository } from '../repositories/newsletter.repository';
import { NewsletterService } from '../services/newsletter.service';
import { NewsletterDto } from '../dtos/newsletterDto';

@Controller({
  version: '1',
  path: 'newsletter',
})
export class NewsletterController {
  constructor(
    private repository: NewsletterRepository,
    private service: NewsletterService,
  ) {}

  @Post()
  async create(@Body() request: NewsletterDto) {
    const data = {
      ...request,
    };
    await this.repository.save(data);
    // Save subscriber to Mailchimp
    await this.service.addSubscriber(request?.email);
    //Send Email
    const subject = 'Newsletter Subscriped';
    const content = `Hi, <br/> <p>You are Subscribed the Newsletter Successfully.</p><br/>Thanks,<br/>Supplier Database`;
    await this.service.sendEmail('', request?.email, subject, content);
    return {
      statusCode: HttpStatus.CREATED,
      status: 'Your newsletter created successfully!',
    };
  }
}
