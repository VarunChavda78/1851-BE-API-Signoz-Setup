import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LayoutService {
  constructor(private readonly configService: ConfigService) {}

  async getheader() {
    return {
      publication: {
        id: '1851',
        name: '1851 Franchise',
        url: 'https://1851franchise.com',
        logo: `${this.configService.get(
          's3.imageUrl',
        )}/supplier-db/static/1851-header-logo.svg`,
      },
      otherPublication: [
        {
          id: 'growth-club',
          name: '1851 Growth Club',
          url: 'https://1851growthclub.com',
          logo: `${this.configService.get(
            's3.imageUrl',
          )}/supplier-db/static/rino-header-logo.svg`,
        },
        {
          id: 'EE',
          name: 'Estatenvy',
          url: 'https://estatenvy.com',
          logo: `${this.configService.get(
            's3.imageUrl',
          )}/supplier-db/static/ee-header-logo.svg`,
        },
        {
          id: 'ROOM-1903',
          name: 'Room 1903',
          url: 'https://room1903.com',
          logo: `${this.configService.get(
            's3.imageUrl',
          )}/supplier-db/static/1903-header-logo.svg`,
        },
        {
          id: 'Stachecow',
          name: 'Stachecow',
          url: 'https://stachecow.com',
          logo: `${this.configService.get(
            's3.imageUrl',
          )}/supplier-db/static/sc-header-logo.svg`,
        },
      ],
      socialMedia: await this.socialMediaLinks(),
    };
  }

  async getFooter() {
    return {
      logo: '',
      socialLinks: await this.socialMediaLinks(),
      supplierMenus: [
        {
          name: 'Find Supplier',
          url: `${this.configService.get('franchise.url')}/searchpopup`,
        },
        {
          name: 'Supplier Power Rankings',
          url: '#',
        },
        {
          name: 'Reviews',
          url: '#',
        },
        {
          name: 'Create A Profile',
          url: '#',
        },
        {
          name: 'Pricing',
          url: '#',
        },
      ],
      menus: [
        {
          name: 'About 1851',
          url: `${this.configService.get('franchise.url')}/about`,
        },
        {
          name: 'Contact',
          url: `${this.configService.get('franchise.url')}/contact-editorial`,
        },
        {
          name: 'Site Map',
          url: `${this.configService.get('franchise.url')}/sitemap`,
        },
        {
          name: 'Terms of Use',
          url: `${this.configService.get('franchise.url')}/terms-of-use`,
        },
      ],
      content:
        'FRANCHISE OFFER This information is not intended as an offer to sell, or the solicitation of an offer to buy, a franchise. It is for information purposes only. Currently, the following states regulate the offer and sale of franchises: California, Hawaii, Illinois, Indiana, Maryland, Michigan, Minnesota, New York, North Dakota, Oregon, Rhode Island, South Dakota, Virginia, Washington, and Wisconsin. If you are a resident of one of these states, we will not offer you a franchise unless and until we have complied with applicable pre-sale registration and disclosure requirements in your jurisdiction. Franchise offerings are made by Franchise Disclosure Document only.',
    };
  }

  async socialMediaLinks() {
    return [
      'https://www.facebook.com/1851magazine',
      'https://www.instagram.com/1851franchise/',
      'https://twitter.com/1851Franchise',
      'https://www.linkedin.com/company/1851-project',
      'https://www.youtube.com/c/1851Franchise',
    ];
  }

  async brandBenefits() {
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

  async isUrl(s) {
    const regexp =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
  }

  async getThumbnailUrl(url) {
    const vimeo = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
    const youtube =
      /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
    let thumbnail = null;
    if (youtube.test(url)) {
      thumbnail = await this.getYoutubeThumbnail(url);
    } else if (vimeo.test(url)) {
      thumbnail = await this.getVimeoThumbnail(url);
    }
    return thumbnail;
  }

  async getYoutubeThumbnail(videoUrl: string): Promise<string> {
    // Extract video ID from the YouTube URL
    const videoId = videoUrl.split('v=')[1];

    // Construct the YouTube thumbnail URL
    const thumbnailUrl = `${this.configService.get(
      'youtube.baseUrl',
    )}/${videoId}/maxresdefault.jpg`;

    return thumbnailUrl;
  }

  async getVimeoThumbnail(videoUrl: string): Promise<string> {
    // Extract video ID from the Vimeo URL
    const videoId = videoUrl.split('/').pop();

    // Construct the Vimeo thumbnail URL (publicly accessible)
    const thumbnailUrl = `${this.configService.get(
      'vimeo.baseUrl',
    )}/${videoId}_1280.jpg`;

    return thumbnailUrl;
  }
}
