import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SocialPlatformText,
  SocialPlatforms,
} from 'src/social-platform/dtos/SocialPlatformDto';
import { SocialPlatformRepository } from 'src/social-platform/repositories/social-platform.repository';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';

@Injectable()
export class LayoutService {
  constructor(
    private readonly configService: ConfigService,
    private supplierRepo: SupplierRepository,
    private socialRepo: SocialPlatformRepository,
  ) {}

  async getheader(slug) {
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
      socialMedia: await this.socialMediaLinks(slug),
    };
  }

  async getFooter(slug) {
    const supplierMenus = [];
    supplierMenus.push({
      name: 'Find Supplier',
      url: `${this.configService.get('franchise.url')}/searchpopup`,
    });
    if (!slug) {
      supplierMenus.push({
        name: 'Supplier Power Rankings',
        url: `${this.configService.get(
          'franchise.url',
        )}/supplier/power-ranking`,
      });
    }
    supplierMenus.push(
      {
        name: 'Create A Profile',
        url: '#',
      },
      {
        name: 'Pricing',
        url: `${this.configService.get('franchise.url')}/about#tellus`,
      },
    );
    return {
      logo: {
        image: `${this.configService.get(
          's3.imageUrl',
        )}/supplier-db/static/1851-footer-logo.svg`,
        url: `${this.configService.get('franchise.url')}/supplier`,
      },
      socialLinks: await this.socialMediaLinks(slug),
      supplierMenus,
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

  async socialMediaLinks(slug) {
    const platforms = [];
    if (slug) {
      const supplier = await this.supplierRepo
        .createQueryBuilder('suppliers')
        .where('suppliers.slug = :slug', { slug })
        .getOne();
      if (supplier) {
        const socialPlatforms = await this.socialRepo
          .createQueryBuilder('social_platform')
          .addSelect(
            'CASE WHEN social_platform.type = :facebook THEN social_platform.url END',
            'facebook',
          )
          .addSelect(
            'CASE WHEN social_platform.type = :linkedin THEN social_platform.url END',
            'linkedin',
          )
          .addSelect(
            'CASE WHEN social_platform.type = :youtube THEN social_platform.url END',
            'youtube',
          )
          .addSelect(
            'CASE WHEN social_platform.type = :instagram THEN social_platform.url END',
            'instagram',
          )
          .setParameter('facebook', SocialPlatforms.FACEBOOK)
          .setParameter('linkedin', SocialPlatforms.LINKEDIN)
          .setParameter('youtube', SocialPlatforms.YOUTUBE)
          .setParameter('instagram', SocialPlatforms.INSTAGRAM)
          .where('user_id = :user_id', { user_id: supplier.user_id })
          .getRawMany();
        if (socialPlatforms.length) {
          const types = [
            SocialPlatformText.FACEBOOK,
            SocialPlatformText.LINKEDIN,
            SocialPlatformText.YOUTUBE,
            SocialPlatformText.INSTAGRAM,
          ];
          for (const socialPlatform of socialPlatforms) {
            for (const type of types) {
              if (socialPlatform[type]) {
                platforms.push({
                  title: type,
                  url: socialPlatform[type],
                });
              }
            }
          }
        }
      }
    } else {
      platforms.push([
        {
          title: 'facebook',
          url: 'https://www.facebook.com/1851magazine',
        },
        {
          title: 'linkedin',
          url: 'https://www.linkedin.com/company/1851-project',
        },
        {
          title: 'youtube',
          url: 'https://www.youtube.com/c/1851Franchise',
        },
        {
          title: 'instagram',
          url: 'https://www.instagram.com/1851franchise/',
        },
        {
          title: 'twitter',
          url: 'https://twitter.com/1851Franchise',
        },
      ]);
    }
    return platforms;
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

  async getStates() {
    return [
      {
        value: 'IL',
        label: 'IL',
      },
      {
        value: 'MI',
        label: 'MI',
      },
      {
        value: 'TX',
        label: 'TX',
      },
      {
        value: 'NY',
        label: 'NY',
      },
      {
        value: 'WI',
        label: 'WI',
      },
      {
        value: 'CO',
        label: 'CO',
      },
      {
        value: 'ND',
        label: 'ND',
      },
      {
        value: 'UT',
        label: 'UT',
      },
      {
        value: 'OH',
        label: 'OH',
      },
      {
        value: 'NJ',
        label: 'NJ',
      },
      {
        value: 'ON',
        label: 'ON',
      },
    ];
  }
}
