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
      
      console.log('reCAPTCHA response:', JSON.stringify(response?.data));
      
      // For custom domains, be more lenient with verification
      if (isCustomDomain) {
        // Check for specific error types that we want to bypass for custom domains
        const hasDomainError = 
          response?.data['error-codes']?.includes('hostname-mismatch') ||
          response?.data['error-codes']?.includes('browser-error');
        
        // Accept the token despite certain errors for custom domains
        if (response?.data?.success === true || 
            (response?.data?.success === false && hasDomainError)) {
          
          // Log for audit purposes
          if (hasDomainError) {
            console.log(`reCAPTCHA error bypassed for custom domain ${hostname}: ${JSON.stringify(response?.data['error-codes'])}`);
          }
          
          return true;
        }
      } else {
        // Standard verification for your main domain/subdomains
        if (response?.data?.success && response?.data?.score > 0.5) {
          return true;
        }
      }
      
      // Log the failure reason
      console.log(`reCAPTCHA verification failed: ${JSON.stringify(response?.data)}`);
      return false;
    } catch (error) {
      console.error('Error verifying captcha:', error);
      throw error;
    }
  }

}
