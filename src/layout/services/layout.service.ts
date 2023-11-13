import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LayoutService {
  constructor(private readonly configService: ConfigService) {}

  getheader() {
    return {
      publication: {
        id: '1851',
        name: '1851 Franchise',
        url: 'https://1851franchise.com',
        logo: `${this.configService.get('s3.imageUrl')}/static/1851_header.png`,
      },
      otherPublication: [
        {
          id: 'growth-club',
          name: '1851 Growth Club',
          url: 'https://1851growthclub.com',
          logo: `${this.configService.get('s3.imageUrl')}/static/GC-logo.svg`,
        },
        {
          id: 'EE',
          name: 'Estatenvy',
          url: 'https://estatenvy.com',
          logo: `${this.configService.get('s3.imageUrl')}/static/EE_header.png`,
        },
        {
          id: 'ROOM-1903',
          name: 'Room 1903',
          url: 'https://room1903.com',
          logo: `${this.configService.get(
            's3.imageUrl',
          )}/static/ROOM-1903_header.png`,
        },
        {
          id: 'Stachecow',
          name: 'Stachecow',
          url: 'https://stachecow.com',
          logo: `${this.configService.get(
            's3.imageUrl',
          )}/static/Stachecow_header.svg`,
        },
      ],
      logo: {
        width: 54,
        height: 54,
        url: '/',
        image: `${this.configService.get('s3.imageUrl')}/static/1851Logo.svg`,
      },
      socialMedia: [
        'https://www.facebook.com/1851magazine',
        'https://www.instagram.com/1851franchise/',
        'https://twitter.com/1851Franchise',
        'https://www.linkedin.com/company/1851-project',
        'https://www.youtube.com/c/1851Franchise',
      ],
    };
  }
}
