import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NewsletterService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async addSubscriber(email) {
    const apiKey = this.config.get('mailchimp.apiKey');
    const audienceId = this.config.get('mailchimp.audienceId');
    const apiUrl = `${this.config.get('mailchimp.apiUrl')}/${audienceId}`;

    const data = {
      email_address: email,
      status: 'subscribed',
    };
    try {
      const response = await this.httpService
        .post(`${apiUrl}/members`, data, {
          headers: {
            Authorization: `Basic ${Buffer.from(`apikey:${apiKey}`).toString(
              'base64',
            )}`,
          },
        })
        .toPromise();
      if (response.status) {
        return response.status;
      }
    } catch (e) {
      return e?.response?.data?.title;
    }
  }
}
