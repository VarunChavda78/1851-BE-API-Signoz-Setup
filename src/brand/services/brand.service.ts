import { Injectable } from '@nestjs/common';
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
    const { page, limit, order, sort } = pageOptionsDto;
    const skip = (page - 1) * limit;
    const orderBy: any = order?.toUpperCase() ?? 'ASC';
    const queryBuilder = this.repository.createQueryBuilder('brand');
    const itemCount = await queryBuilder.getCount();
    const brands = await queryBuilder
      .orderBy(sort, orderBy)
      .skip(skip)
      .take(limit)
      .getMany();
    const data = await this.getDetails(brands);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, pageMetaDto);
  }

  async getDetails(brands) {
    const data = [];
    if (brands.length) {
      for (const brand of brands) {
        data.push({
          id: brand?.id,
          name: brand?.name,
          slug: brand?.slug,
          logo: `${this.config.get(
            's3.imageUrl',
          )}/supplier-db/brand/${brand?.logo}`,
          url: `${this.config.get('franchise.url')}/${brand?.slug}`,
        });
      }
    }
    return data;
  }
}
