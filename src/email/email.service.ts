import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EnvironmentConfigService } from 'src/shared/config/environment-config.service';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private readonly config: EnvironmentConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.getSmtpHost(),
      port: parseInt(this.config.getSmtpPort()),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.config.getSmtpUserName(),
        pass: this.config.getSmtpPassword(),
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false,
        },
      },
    } as Options);
  }
  async sendEmail(data: any) {
    try {
      await this.transporter.sendMail(data);
      return true;
    } catch (error) {
      return false;
    }
  }
}
