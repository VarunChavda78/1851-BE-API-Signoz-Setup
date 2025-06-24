import { Injectable } from '@nestjs/common';
import { EnvironmentConfigService } from '../shared/config/environment-config.service';
import { CommonService } from 'src/shared/services/common.service';

@Injectable()
export class LeadsUtilService {
  constructor(
    private config: EnvironmentConfigService,
    private commonService: CommonService,
  ) {}
  async sendPdfEmailToBrand(request, brand, inquiryEmails?: any, landingPageUrl?: string, landingPageName?: string) {
    const fromEmail = this.config.getFromEmail();
    const toEmail = inquiryEmails?.length > 0 ? inquiryEmails : brand?.email || [];
    const bccMail = [this.config.getBccEmail()];
    const sign = this.commonService.getEmailSign();
    const subject = `Download Brochure PDF Inquiry for ${landingPageName}`;

    const leadData = [{ name: 'Email', value: request?.email || '' }];
    const content = this.getPdfContent(leadData, brand, sign, landingPageUrl);
    await this.commonService.sendMassEmailWithCC(
      toEmail,
      bccMail,
      fromEmail,
      subject,
      content,
    );
  }

  private getPlainContent(data): string {
    const content = data
      .filter((item) => item?.name?.trim() && item?.value?.trim())
      .map((item) => `${item.name}: ${item.value}<br>`);
    return content.join('') || '';
  }

  private getPdfContent(data, brand, sign, url: string): string {
    let content = `Hi ${brand?.company},<br><br>
    There's been a Download PDF lead on your ${sign} landing page <a href="${url}" target="_blank">${url}</a>.<br><br>`;

    content += this.getPlainContent(data);
    content += `<br>Thanks,<br>${sign} Team`;
    return content;
  }

  private getContent(data, brand, sign, url: string): string {
    let content = `Hi ${brand?.company},<br><br>
    You've received a new lead from your landing page <a href="${url}" target="_blank">${url}</a>. The information is below.<br><br>`;

    content += this.getPlainContent(data);
    content += `<br><br>Thanks,<br>${sign} Support Team`;
    return content;
  }

  async sendEmailToUser(request: { [key: string]: string }, brand: any) {
    const subject = 'Your Inquiry Has Been Received – Expect a Follow-Up Soon!';
    const fromEmail = this.config.getFromEmail();
    const noreplyEmail = this.config.getNoReplyEmail();
    const ccEmail = [this.config.getBccEmail()];
    const feUrl = this.config.getFEUrl();
    const brandUrl = `${feUrl}/${brand?.brandUrl}`;
    const link = `<a href="${brandUrl}">${brandUrl}</a>`;

    const toEmail = [request.email];

    const placeholders = {
      '{{name}}': `${this.capitalize(request.firstName)} ${this.capitalize(
        request.lastName,
      )}`,
      '{{brand}}': brand?.company,
      '{{brand_url}}': link,
    };

    // Convert object to leadData format
    const leadData = Object.entries(request).map(([field, value]) => ({
      name: this.formatFieldName(field),
      value: value || '',
    }));

    let content = '';
    Object.keys(placeholders).forEach((key) => {
      content = content.replace(new RegExp(key, 'g'), placeholders[key]);
    });

    content += this.addLeadsDetails(brand, leadData);
    await this.commonService.sendMassEmailWithCC(
      toEmail,
      ccEmail,
      fromEmail,
      subject,
      content,
      noreplyEmail,
    );
  }

  async sendEmailToBrand(request: { [key: string]: string }, brand: any, inquiryEmails:any, landingPageUrl?: string, landingPageName?: string) {
    const fromEmail = this.config.getFromEmail();
    const toEmail = inquiryEmails?.length > 0 ? inquiryEmails : brand?.email || [];
    const bccMail = [this.config.getBccEmail()];
    const sign = this.commonService.getEmailSign();
    const subject = `New Lead from your landing page - ${landingPageName}`;

    // Convert object to leadData format
    const leadData = Object.entries(request).map(([field, value]) => ({
      name: this.formatFieldName(field),
      value: value || '',
    }));

    const content = this.getContent(leadData, brand, sign, landingPageUrl);
    await this.commonService.sendMassEmailWithCC(
      toEmail,
      bccMail,
      fromEmail,
      subject,
      content,
    );
  }

  private addLeadsDetails(brand, data): string {
    let content =
      `<strong>Hi ${data[0] && data[0].value}</strong>,` +
      `<p>Thank you for expressing interest in ${brand?.company?.toUpperCase()}. We have received your information. Someone from the team will be in touch shortly.</p>` +
      '<p>Below is a copy of the information you have submitted:</p>';
    content += `<p>${this.getPlainContent(
      data,
    )}</p>Thanks,<br>${brand?.company}`;
    return content;
  }

  public formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/Zip/g, 'ZIP')
      .trim();
  }

  private capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
