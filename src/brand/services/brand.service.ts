import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BrandService {
  constructor(private readonly config: ConfigService) {}

  async getDetails(brands) {
    const data = [];
    for (const brand of brands) {
      data.push({
        id: brand?.id,
        name: brand?.name,
        logo: `${this.config.get(
          's3.imageUrl',
        )}/supplier-db/brand/${brand?.logo}`,
        url: brand?.url,
      });
    }
    return data;
  }
}
