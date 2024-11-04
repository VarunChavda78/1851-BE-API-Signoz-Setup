import { Body, Controller, Post } from '@nestjs/common';
import { EnvironmentConfigService } from 'src/shared/config/environment-config.service';
import { EmailService } from './email.service';
import * as admin from 'firebase-admin';
// import * as serviceAccount from './gcp-auth.json';

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
// });

@Controller({
  version: '1',
  path: 'email',
})
export class EmailController {
  constructor(
    private config: EnvironmentConfigService,
    private service: EmailService,
  ) {}

  @Post('forgot-password')
  async forgotPassword(@Body() request: any) {
    try {
      const response = await fetch(
        'https://1851-dev.s3.us-east-1.amazonaws.com/static/gcp-auth.json',
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const serviceAccount = await response.json();

      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
      const subject = 'Reset your password for 1851 Franchise';
      const tenantId = this.config.getTenantId();
      const emailId = request?.email;
      const tenantAuth = admin.auth().tenantManager().authForTenant(tenantId);
      const link = await tenantAuth.generatePasswordResetLink(emailId);
      const content = `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Admin Password Reset Notice</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            line-height: 1.6;\n            color: #333;\n            max-width: 600px;\n            margin: 0 auto;\n            padding: 20px;\n        }\n        h4 {\n            margin-bottom: 20px;\n        }\n        p {\n            margin-bottom: 15px;\n        }\n        ol {\n            margin-left: 20px;\n            margin-bottom: 15px;\n        }\n        .signature {\n            margin-top: 20px;\n        }\n    </style>\n</head>\n<body>\n    <h4>Hello,</h4>\n    \n    <p>Follow this link to reset your 1851 Franchise password for your ${emailId} account.
  </p>\n    \n    <p><a href="${link}" target="_blank">${link}</a></p>\n    <p>\n      \n    <p>If you didn’t ask to reset your password, you can ignore this email.</p>\n    \n    <p class="signature">Best Regards,<br>1851 Franchise Team</p>\n</body>\n</html>`;

      const email = {
        to: request?.email,
        from: this.config.getNoReplyEmail(),
        bcc: this.config.getBccEmail(),
        subject: subject,
        html: content,
      };
      await this.service.sendEmail(email);
      return { message: 'Email Sent Successfully' };
    } catch (error) {
      console.error('Error generating password reset link:', error);
    }
  }
}
