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
    const sign = this.getEmailSign() || '1851';
    const subject = `New Landing Lead from ${sign}`;

    const leadData = [
      { name: 'First Name', value: request?.firstName || '' },
      { name: 'Last Name', value: request?.lastName || '' },
      { name: 'Email', value: request?.email || '' },
      { name: 'Phone', value: request?.phone || '' },
      { name: 'City', value: request?.city || '' },
      { name: 'State', value: request?.state || '' },
      { name: 'ZIP', value: request?.zip || '' },
      { name: 'Interest', value: request?.interest || '' },
      { name: 'Looking For', value: request?.lookingFor || '' },
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
  async sendEmailToUser(request, brand) {
    const subject = 'Landing Lead Call!';
    const fromEmail = this.config.getFromEmail();
    const toEmail = [request?.email];
    const noreplyEmail = this.config.getNoReplyEmail();
    const ccEmail = [this.config.getBccEmail()];
    const firstName = request?.firstName;
    const lastName = request?.lastName;
    const feUrl = this.config.getFEUrl();
    const brandUrl = `${feUrl}/${brand?.brandUrl}`;
    const link = `<a href="${brandUrl}">${brandUrl}</a>`;
    const placeholders = {
      '{{name}}': `${this.capitalize(firstName)} ${this.capitalize(lastName)}`,
      '{{brand}}': brand?.company,
      '{{brand_url}}': link,
    };
    const leadData = [
      { name: 'First Name', value: request?.firstName || '' },
      { name: 'Last Name', value: request?.lastName || '' },
      { name: 'Email', value: request?.email || '' },
      { name: 'Phone', value: request?.phone || '' },
      { name: 'City', value: request?.city || '' },
      { name: 'State', value: request?.state || '' },
      { name: 'ZIP', value: request?.zip || '' },
      { name: 'Interest', value: request?.interest || '' },
      { name: 'Looking For', value: request?.lookingFor || '' },
    ];
    let content = '';
    Object.keys(placeholders).forEach((key) => {
      content = content.replace(new RegExp(key, 'g'), placeholders[key]);
    });
    content += this.addLeadsDetails(brand, leadData);
    await this.sendMassEmailWithCC(
      toEmail,
      ccEmail,
      fromEmail,
      subject,
      content,
      noreplyEmail,
    );
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

  public capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  private getPlainContent(data): string {
    const content = data
      .filter((item) => item?.name?.trim() && item?.value?.trim())
      .map((item) => `${item.name}: ${item.value}<br>`);
    return content.join('') || '';
  }

  private getContent(data, brand, sign): string {
    let content = `Hi ${brand?.company},<br><br>
    You've received a new lead from your landing page. The information is below.<br><br>`;

    content += this.getPlainContent(data);
    content += `<br><br>Thanks,<br>${sign} Support Team`;
    return content;
  }

  private addLeadsDetails(brand, data): string {
    let content =
      `<strong>HI ${data[0] && data[0].value?.toUpperCase()}</strong>,` +
      `<p>Thank you for expressing interest in ${brand?.company?.toUpperCase()}. We have received your information. Someone from the team will be in touch shortly.</p>` +
      '<p>Below is a copy of the information you have submitted:</p>';
    content += `<p>${this.getPlainContent(
      data,
    )}</p><p>Thanks,</p><p>${brand?.company}</p>`;
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
