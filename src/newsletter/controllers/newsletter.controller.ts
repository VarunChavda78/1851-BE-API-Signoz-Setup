import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { NewsletterService } from '../services/newsletter.service';
import { NewsletterDto } from '../dtos/newsletterDto';
import { ConfigService } from '@nestjs/config';
import { NewsletterRepository } from '../repositories/newsletter.repository';

@Controller({
  version: '1',
  path: 'newsletter',
})
export class NewsletterController {
  constructor(
    private repository: NewsletterRepository,
    private config: ConfigService,
    private service: NewsletterService,
  ) {}

  @Post()
  async create(@Body() request: NewsletterDto) {
    const data = {
      ...request,
    };
    await this.repository.save(data);
    // Save subscriber to Mailchimp
    const response = await this.service.addSubscriber(request?.email);
    //Send Email
    const subject = 'Newsletter Subscriped';
    const content = `Hi, <br/> <p>You are Subscribed the Newsletter Successfully.</p><br/>Thanks,<br/>Supplier Database`;
    if (response === 200) {
      await this.service.sendEmail(
        this.config.get('smtp.fromEmail'),
        request?.email,
        subject,
        content,
      );
      return {
        statusCode: HttpStatus.CREATED,
        status: 'Your newsletter created successfully!',
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: response ?? 'Bad Request',
      };
    }
  }
}
