import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ClaimProfileService {
  constructor(private readonly config: ConfigService) {}

  async sendEmail(toEmail: string) {
    const subject = 'Call Scheduled';
    const message = `Hi, <br/> <p>Your call was scheduled Successfully!</p><br/>Thanks,<br/>Supplier Database`;
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
      from: this.config.get('smtp.fromEmail'),
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
