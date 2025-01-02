import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { EnvironmentConfigService } from '../config/environment-config.service';

@Injectable()
export class VerifyCaptchaService {
  constructor(
    private httpService: HttpService,
    private readonly env: EnvironmentConfigService,
  ) {}

  async verifyCaptcha(captchaResponse: string): Promise<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const secretKey = this.env.getGoogleRecaptchaSecretKey();
    const formData = `secret=${secretKey}&response=${captchaResponse}`;

    const url = `https://www.google.com/recaptcha/api/siteverify`;
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(url, formData, { headers }),
      );

      if (response && response?.data?.success && response?.data?.score > 0.5) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error verifying captcha. Please try again later', error);
      throw error;
    }
  }
}
