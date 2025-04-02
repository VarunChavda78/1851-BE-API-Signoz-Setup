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

  async verifyCaptcha(captchaResponse: string, hostname?: string): Promise<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const secretKey = this.env.getGoogleRecaptchaSecretKey();
    let formData = `secret=${secretKey}&response=${captchaResponse}`;

    // Get the base URL from environment
    const baseUrl = this.env.getFEUrl();
    
    // Extract the domain name from the base URL (remove protocol and path)
    const baseDomain = baseUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    // Check if hostname is a custom domain or your primary domain/subdomain
    const isCustomDomain = hostname && 
                          !hostname.endsWith(baseDomain) && 
                          !hostname.includes(`.${baseDomain}`);
    
    if (isCustomDomain) {
      console.log(`Verifying reCAPTCHA for custom domain: ${hostname}`);
    }

    const url = `https://www.google.com/recaptcha/api/siteverify`;
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(url, formData, { headers }),
      );
      
      console.log('reCAPTCHA response:', response?.data);
      
      // For custom domains, handle domain mismatch errors differently
      if (isCustomDomain) {
        // Check if the error is specifically a hostname mismatch
        const hasHostnameMismatch = response?.data['error-codes']?.includes('hostname-mismatch');
        
        // For custom domains, accept the token despite hostname mismatch
        // This is the key part that allows custom domains to work
        if (response?.data?.success === true || 
            (response?.data?.success === false && hasHostnameMismatch)) {
          
          // Optionally, log this for audit purposes
          if (hasHostnameMismatch) {
            console.log(`reCAPTCHA hostname mismatch accepted for custom domain: ${hostname}`);
          }
          
          return true;
        }
      } else {
        // Standard verification for your main domain/subdomains
        if (response?.data?.success && response?.data?.score > 0.5) {
          return true;
        }
      }
      
      // Log the failure reason for debugging
      console.log(`reCAPTCHA verification failed: ${JSON.stringify(response?.data)}`);
      return false;
    } catch (error) {
      console.error('Error verifying captcha. Please try again later', error);
      throw error;
    }
  }
}
