import { Injectable } from '@nestjs/common';
import { EnvironmentConfigService } from '../shared/config/environment-config.service';
import { RollbarLogger } from 'nestjs-rollbar';
import * as nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/json-transport';

@Injectable()
export class LeadsUtilService {
  constructor(
    private config: EnvironmentConfigService,
    private logger: RollbarLogger,
  ) {}
  async sendEmailToBrand(request, brand) {
    const fromEmail = this.config.getFromEmail();
    const toEmail = brand?.email || [];
    const bccMail = [this.config.getBccEmail()];
    const sign = this.getEmailSign();
    const subject = `Download Landing Lead - ${sign}`;

    const leadData = [
      { name: 'Email', value: request?.email || '' },
    ];
    const content = this.getContent(leadData, brand, sign);
    await this.sendMassEmailWithCC(
      toEmail,
      bccMail,
      fromEmail,
      subject,
      content,
    );
  }

  private async sendMassEmailWithCC(
    toEmail: string[],
    ccMail: string[],
    fromEmail: string,
    subject: string,
    content: string,
    noreplyEmail = '',
  ): Promise<void> {
    const mailOptions = {
      from: noreplyEmail ? noreplyEmail : fromEmail,
      to: toEmail.join(', '),
      cc: ccMail.length > 0 ? ccMail.join(', ') : '',
      subject: subject,
      html: content,
      replyTo: fromEmail,
    };

    try {
      const transporter = this.initTransporter();
      const info = await transporter.sendMail(mailOptions);
      this.logger.log(`Message sent: %s`, info.messageId);
    } catch (error) {
      this.logger.error(`Failed to send email:`, error);
    }
  }

  private initTransporter() {
    return nodemailer.createTransport({
      host: this.config.getSmtpHost(),
      port: this.config.getSmtpPort(),
      secure: false,
      auth: {
        user: this.config.getSmtpUserName(),
        pass: this.config.getSmtpPassword(),
      },
    } as Options);
  }

  private getPlainContent(data): string {
    const content = data
      .filter((item) => item?.name?.trim() && item?.value?.trim())
      .map((item) => `${item.name}: ${item.value}<br>`);
    return content.join('') || '';
  }

  private getContent(data, brand, sign): string {
    let content = `HI ${brand?.company?.toUpperCase()},<br><br>
    There's been a Download PDF lead on your 1851 Franchise landing page.<br><br>`;

    content += this.getPlainContent(data);
    content += `<br>Thanks,<br>${sign} Team`;
    return content;
  }

  getEmailSign(): string {
    const siteId = this.config.getSiteId();
    let sign = '1851 Franchise';

    switch (siteId) {
      case 'EE':
        sign = 'Estatenvy';
        break;
      case 'ROOM-1903':
        sign = 'Room 1903';
        break;
      case 'Stachecow':
        sign = 'Stachecow';
        break;
    }
    return sign;
  }
}
