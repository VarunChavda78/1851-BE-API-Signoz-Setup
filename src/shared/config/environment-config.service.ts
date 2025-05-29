import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService extends ConfigService {
  getImageProxyUrl(): string {
    return this.get<string>('s3.imageUrl');
  }
  getAppUrl(): string {
    return this.get<string>('appUrl');
  }
  getAppDomain(): string {
    return this.get<string>('appDomain');
  }
  getAppEnv(): string {
    return this.get<string>('env');
  }
  getAwsS3Url(): string {
    return this.get<string>('aws.s3Url');
  }
  getFEUrl(): string {
    return this.get<string>('url.fe');
  }
  getSmtpHost(): string {
    return this.get<string>('smtp.host');
  }
  getSmtpPort(): string {
    return this.get<string>('smtp.port');
  }
  getSmtpUserName(): string {
    return this.get<string>('smtp.username');
  }
  getSmtpPassword(): string {
    return this.get<string>('smtp.password');
  }
  getFromEmail(): string {
    return this.get<string>('email.from');
  }
  getNoReplyEmail(): string {
    return this.get<string>('email.noReply');
  }
  getBccEmail(): string {
    return this.get<string>('email.bcc');
  }
  getTenantId(): string {
    return this.get<string>('gip.tenantId');
  }
  getGoogleRecaptchaSecretKey(): string {
    return this.get<string>('recaptcha.googleRecaptchaSecretKey');
  }
  getSiteId(): string {
    return this.get<string>('siteId');
  }
  getGoogleClientId(): string {
    return this.get<string>('google.clientId');
  }
  getGoogleClientSecret(): string {
    return this.get<string>('google.clientSecret');
  }
  getGoogleRedirectUrl(): string {
    return this.get<string>('google.redirectUrl');
  }
  
}
