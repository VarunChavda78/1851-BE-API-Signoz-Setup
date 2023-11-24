import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NewsletterService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async addSubscriber(email) {
    const apiKey = this.config.get('mailchimp.apiKey');
    const listId = this.config.get('mailchimp.listId');
    const apiUrl = `${this.config.get('mailchimp.apiUrl')}/${listId}`;

    const data = {
      members: [
        {
          email_address: email,
          status: 'subscribed',
        },
      ],
    };

    const response = await this.httpService
      .post(`${apiUrl}/members`, data, {
        headers: {
          Authorization: `Basic ${Buffer.from(`apikey:${apiKey}`).toString(
            'base64',
          )}`,
        },
      })
      .toPromise();

    return response.data;
  }
  async sendEmail(
    fromEmail: string,
    toEmail: string,
    subject: string,
    message: string,
  ) {
    const transporter = nodemailer.createTransport({
      host: this.config.get('smtp.host'),
      port: this.config.get('smtp.port'),
      auth: {
        user: this.config.get('smtp.username'),
        pass: this.config.get('smtp.password'),
      },
    });
    let mailOptions = null;
    mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions, function (error) {
      if (error) {
        console.error(error);
      }
    });
  }
}
