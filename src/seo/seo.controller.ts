import { Controller, Get, Query } from '@nestjs/common';
import { SeoRepository } from './seo.repository';
import { ConfigService } from '@nestjs/config';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';

@Controller({
  version: '1',
  path: 'seo',
})
export class SeoController {
  constructor(
    private repository: SeoRepository,
    private config: ConfigService,
    private supplierRepository: SupplierRepository,
  ) {}

  @Get()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async seo(@Query() query: { type: any; object_type: any; object_id: any }) {
    const queryBuilder = this.repository
      .createQueryBuilder('seo')
      .leftJoinAndSelect('seo.seoKeyword', 'seo_keyword')
      .where('seo.seoTypeId = :type', { type: Number(query.type) })
      .andWhere('seo.object_type = :object_type', {
        object_type: query.object_type,
      });
    if (Number(query.object_id)) {
      queryBuilder.andWhere('seo.object_id = :object_id', {
        object_id: query.object_id,
      });
    }
    const seo = await queryBuilder.getOne();
    let ogImage: string = `${this.config.get(
      's3.imageUrl',
    )}/static/1851-og.jpg`;
    let ogSiteName: string =
      '1851 Franchise Magazine, Franchise News, Information, franchise opportunities';
    let data;
    let url = `${this.config.get('franchise.url')}/supplier`;
    if (Number(query.object_id)) {
      const supplier = await this.supplierRepository
        .createQueryBuilder('suppliers')
        .where('suppliers.id = :id', { id: query.object_id })
        .getOne();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ogImage = `${this.config.get(
        's3.imageUrl',
      )}/supplier-db/supplier/${supplier?.id}/${supplier?.logo}`;
      url = `${this.config.get('franchise.url')}/supplier/${supplier?.slug}`;
    }
    if (seo) {
      ogSiteName = seo.meta_title;
      data = {
        seo: {
          title: seo.meta_title,
          description: seo.meta_description,
          keywords: seo.seoKeyword,
        },
        og: {
          title: seo.meta_title,
          description: seo.meta_description,
          image: ogImage,
          siteName: ogSiteName,
          url: url,
        },
        twitter: {
          title: seo.meta_title,
          description: seo.meta_description,
        },
      };
    } else {
      data = {
        seo: {
          title: '1851 Franchise | Supplier',
          description: 'A fairly ranked franchise supplier resource',
        },
        og: {
          title: '1851 Franchise | Supplier',
          description: 'A fairly ranked franchise supplier resource',
          image: ogImage,
          siteName: ogSiteName,
          url: '',
        },
        twitter: {
          title: '1851 Franchise | Supplier',
          description: 'A fairly ranked franchise supplier resource',
        },
      };
    }
    return { data };
  }
}
