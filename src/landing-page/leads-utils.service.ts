import { Injectable } from '@nestjs/common';
import { LandingPageLeadsRepository } from './landing-page-leads.repository';
import { EnvironmentConfigService } from '../shared/config/environment-config.service';
import axios from 'axios';
import { RollbarLogger } from 'nestjs-rollbar';
import * as nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/json-transport';

@Injectable()
export class LeadsUtilService {
  constructor(
    private repo: LandingPageLeadsRepository,
    private config: EnvironmentConfigService,
    private logger: RollbarLogger,
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
    const emailUrl = `${this.config.getGCUrl()}/api`;
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
  async sendEmailToUser(request) {
    const subject = 'Ready to Join - Your Free Franchise Coaching Call!';
    const data: any = {
      title: 'Franchise Join Call',
      showLogin: false,
      site: {
        logo: `${this.config.getImageProxyUrl()}/static/email-header-logo.png`,
        url: `${this.config.getAppUrl()}`,
        name: `${this.config.getAppDomain()}`,
        address: '211 W Wacker Dr, Ste 100, Chicago, IL 60606',
        signature: '1851 Franchise Team',
      },
      details: {
        userName: `${request?.firstName} ${request?.lastName}`,
        content: `<p>Thank you for booking your free franchise coaching call with us! 🚀</p> <p>We're excited to connect with you and help you on your journey. Someone from our team is ready to connect with you and may call you shortly.</p><p>Looking forward to speaking with you and helping you carve out your franchise success! 🌟</p>`,
      },
      images: {
        topHead: `${this.config.getImageProxyUrl()}/email/thumbsUpHeader.png`,
      },
    };

    const emailUrl = `${this.config.getGCUrl()}/api`;
    try {
      const response = await axios.post(`${emailUrl}/acknowledge`, data);
      const email = {
        to: request?.email,
        from: this.config.getNoReplyEmail(),
        bcc: this.config.getBccEmail(),
        subject: subject,
        html: response?.data?.html,
      };
      //   await this.commonService.sendEmail(email);
    } catch (error) {
      this.logger.error('Lead User Email Error', error?.message);
    }
  }

  async sendEmail(data: any) {
    try {
      const transporter = nodemailer.createTransport({
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
      await transporter.sendMail(data);
      return true;
    } catch (error) {
      return false;
    }
  }
}
