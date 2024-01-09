import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MainPageService {
  constructor(private readonly configService: ConfigService) {}

  async benefits() {
    return {
      title: 'Navigate the franchise industry with',
      data: [
        {
          title: 'Verified Profiles',
          description: `1851’s research team has verified all information to ensure the most up-to-date information on each supplier`,
          logo: `${this.configService.get(
            's3.imageUrl',
          )}/supplier-db/static/profile.svg`,
        },
        {
          title: 'Research & Content Hub',
          description: `A full-circle approach to performing due diligence to ensure your match is the right fit for your franchise.`,
          logo: `${this.configService.get(
            's3.imageUrl',
          )}/supplier-db/static/research-content.svg`,
        },
        {
          title: 'Customer Testimonials ',
          description: `Fellow franchisors, franchisees and business owners can submit reviews on behalf of the franchisor`,
          logo: `${this.configService.get(
            's3.imageUrl',
          )}/supplier-db/static/customer-testimonial.svg`,
        },
      ],
    };
  }
}
