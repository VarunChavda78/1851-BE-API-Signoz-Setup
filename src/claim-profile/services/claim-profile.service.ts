import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sendgrid from '@sendgrid/mail';
import axios from 'axios';

@Injectable()
export class ClaimProfileService {
  constructor(private readonly config: ConfigService) {
    sendgrid.setApiKey(this.config.get('smtp.sendgridKey'));
  }

  async sendEmail(request: any) {
    const emailUrl = this.config.get('franchise.emailUrl');

    const subject = 'Call Scheduled';
    const data = {
      title: 'SCHEDULE A CALL',
      site: {
        logo: `${this.config.get('s3.imageUrl')}/static/email-header-logo.png`,
        url: `${this.config.get('franchise.url')}`,
        name: `${this.config.get('franchise.domain')}`,
        address: 'Prudential Plaza, 130 E Randolph St #1950, Chicago, IL 60601',
        footerText: '',
      },
      details: {
        name: request.name,
        number: request.phone,
        email: request.email,
      },
      images: {
        topHead: `${this.config.get('s3.imageUrl')}/email/thumbsUpHeader.png`,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await axios.post(`${emailUrl}/claim-profile`, data);
    const email = {
      to: this.config.get('smtp.fromEmail'),
      from: this.config.get('smtp.noReplyEmail'),
      cc: '1851-email@pearlthoughts.com',
      subject: subject,
      html: response.data.html,
    };
    await sendgrid.send(email);
  }
}
