import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';
import { BrandRepository } from '../repositories/brand.repository';
import { PageMetaDto } from 'src/shared/dtos/pageMetaDto';
import { PageDto } from 'src/shared/dtos/pageDto';

@Injectable()
export class BrandService {
  constructor(
    private readonly config: ConfigService,
    private repository: BrandRepository,
  ) {}

  async getList(pageOptionsDto: PageOptionsDto) {
    const { skip, limit, order } = pageOptionsDto;
    const brands = await this.repository.find({ skip, take: limit });
    if (!brands.length) {
      throw new NotFoundException();
    }
    const queryBuilder = this.repository.createQueryBuilder('brand');
    const itemCount = await queryBuilder.getCount();
    const review = await queryBuilder
      .orderBy('brand.createdAt', order)
      .skip(skip)
      .take(limit)
      .getMany();
    if (!review.length) {
      throw new NotFoundException();
    }
    const data = await this.getDetails(review);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, pageMetaDto);
  }

  async getDetails(brands) {
    const data = [];
    for (const brand of brands) {
      data.push({
        id: brand?.id,
        name: brand?.name,
        slug: brand?.slug,
        logo: `${this.config.get(
          's3.imageUrl',
        )}/supplier-db/brand/${brand?.logo}`,
        url: brand?.url,
      });
    }
    return data;
  }
}
