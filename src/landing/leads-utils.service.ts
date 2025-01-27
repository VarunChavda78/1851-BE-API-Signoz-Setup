import { Injectable } from '@nestjs/common';
import { EnvironmentConfigService } from '../shared/config/environment-config.service';
import { RollbarLogger } from 'nestjs-rollbar';
import * as nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/json-transport';
import { CommonService } from 'src/shared/services/common.service';

@Injectable()
export class LeadsUtilService {
  constructor(
    private config: EnvironmentConfigService,
    private commonService: CommonService,
  ) {}
  async sendPdfEmailToBrand(request, brand) {
    const fromEmail = this.config.getFromEmail();
    const toEmail = brand?.email || [];
    const bccMail = [this.config.getBccEmail()];
    const sign = this.commonService.getEmailSign();
    const subject = `Download Brochure PDF Inquiry`;

    const leadData = [
      { name: 'Email', value: request?.email || '' },
    ];
    const content = this.getContent(leadData, brand, sign);
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

  private getContent(data, brand, sign): string {
    let content = `HI ${brand?.company?.toUpperCase()},<br><br>
    There's been a Download PDF lead on your ${sign} landing page.<br><br>`;

    content += this.getPlainContent(data);
    content += `<br>Thanks,<br>${sign} Team`;
    return content;
  }
}
