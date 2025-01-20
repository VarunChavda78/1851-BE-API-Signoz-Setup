import { Injectable } from '@nestjs/common';
import { LandingPageLeadsRepository } from './landing-page-leads.repository';
import { EnvironmentConfigService } from '../shared/config/environment-config.service';
import axios, { AxiosResponse } from 'axios';
import { RollbarLogger } from 'nestjs-rollbar';
import * as nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/json-transport';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LeadsUtilService {
  constructor(
    private repo: LandingPageLeadsRepository,
    private config: EnvironmentConfigService,
    private logger: RollbarLogger,
    private httpService: HttpService,
  ) {}
  async sendEmailToBrand(request, slug: string, brand) {
    const subject = '1851 Landing Lead';
    // const fromEmail = this.config.getAdminEmail();
    const toEmail = brand?.email[0];
    // let ccMail = [this.env.getAdminCCEmail()];
    let data: any = {
      title: 'Schedule a Call',
      site: {
        logo: `${this.config.getImageProxyUrl()}/static/email-header-logo.png`,
        url: `${this.config.getAppUrl()}`,
        name: `${this.config.getAppDomain()}`,
        address: '211 W Wacker Dr, Ste 100, Chicago, IL 60606',
      },
      details: [
        { title: 'First Name', value: request?.firstName || '' },
        { title: 'Last Name', value: request?.lastName || '' },
        { title: 'Email', value: request?.email || '' },
        { title: 'Phone', value: request?.phone || '' },
        { title: 'City', value: request?.city || '' },
        { title: 'State', value: request?.state || '' },
        { title: 'Zip', value: request?.zip || '' },
        {
          title: 'Why do you want to buy a franchise?',
          value: request?.interest || '',
        },
      ].filter(
        (item) =>
          item.value !== null && item.value !== undefined && item.value !== '',
      ),
      images: {
        topHead: `${this.config.getImageProxyUrl()}/email/thumbsUpHeader.png`,
      },
    };
    if (slug) {
      data = {
        ...data,
        brand: {
          name: brand?.company,
          url: `${this.config.getImageProxyUrl()}/${brand?.brandLogo}`,
          loginUrl: `${this.config.getAppUrl()}/${slug}/login`,
        },
      };
    }
    const emailUrl = `${this.config.getEmailUrl()}/api`;
    try {
      const response = await axios.post(`${emailUrl}/claim-profile`, data);
      const email = {
        to: toEmail,
        from: this.config.getNoReplyEmail(),
        bcc: this.config.getBccEmail(),
        subject: subject,
        html: response?.data?.html,
      };
    } catch (error) {
      console.log('error', error);
      this.logger.error('Lead Admin Email Error', error?.message);
    }
  }
  async sendEmailToUser(request, brand) {
    const subject = 'Landing Lead Call!';
    const fromEmail = this.config.getFromEmail();
    const toEmail = request?.email;
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

  async sendEmail(data: any) {
    try {
      const transporter = this.initTransporter();
      await transporter.sendMail(data);
      return true;
    } catch (error) {
      return false;
    }
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

  public capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  private getPlainContent(data): string {
    const content = data
      .filter((item) => item?.name?.trim() && item?.value?.trim())
      .map((item) => `${item.name}: ${item.value}<br>`);
    return content.join('') || '';
  }

  private addLeadsDetails(brand, data): string {
    let content =
      `<strong>Hi ${data[0] && data[0].value}</strong>,` +
      '<p>Below is a copy of the information you have submitted:</p>';
    content += `<p>${this.getPlainContent(
      data,
    )}</p><p>Thanks,</p><p>${brand?.company}</p><br>211 W Wacker Dr, Ste 100, Chicago, IL 60606`;
    return content;
  }

  async sendRequest(body: any, endpointUrl: string): Promise<string> {
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(endpointUrl, body, { headers }),
      );

      if (response.status === 200) {
        return response.data.html;
      }
    } catch (error) {
      console.error('Failed to send request:', error);
      throw error;
    }

    return '';
  }
}
