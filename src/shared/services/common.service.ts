import { Injectable } from '@nestjs/common';
import { Pagination } from '../dtos/pagination.dto';
import { EnvironmentConfigService } from '../config/environment-config.service';
import { RollbarLogger } from 'nestjs-rollbar';
import * as nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/json-transport';

@Injectable()
export class CommonService {
  constructor(
    private config: EnvironmentConfigService,
    private logger: RollbarLogger,
  ) {}
  getPagination(totalRecords: number, limit: number, page: number): Pagination {
    const totalPages = Math.ceil(totalRecords / limit);
    return {
      page,
      limit,
      totalRecords,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
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

  async sendSingleEmail(
    fromEmail: string,
    toEmail: string,
    subject: string,
    content: string,
  ): Promise<void> {
    const email = {
      to: toEmail,
      from: fromEmail,
      subject: subject,
      html: content,
    };

    try {
      this.logger.log(
        `Sending email from: ${fromEmail} to: ${toEmail} with subject: ${subject}`,
      );
      const transporter = this.initTransporter();
      await transporter.sendMail(email);
      this.logger.log(`Email sent successfully to: ${toEmail}`);
    } catch (error) {
      this.logger.error(`Error sending email to: ${toEmail}`, error);
    }
  }

  async sendMassEmailWithCC(
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
}
