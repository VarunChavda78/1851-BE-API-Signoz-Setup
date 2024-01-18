import { Controller, Get, Query } from '@nestjs/common';
import { SeoRepository } from './seo.repository';

@Controller({
  version: '1',
})
export class SeoController {
  constructor(private repository: SeoRepository) {}

  @Get('seo')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async seo(@Query() query: { type: any; object_type: any }) {
    const seo = await this.repository
      .createQueryBuilder('seo')
      .leftJoinAndSelect('seo.seoKeyword', 'seo_keyword')
      .where('seo.seoTypeId = :type', { type: Number(query.type) })
      .andWhere('seo.object_type = :object_type', {
        object_type: query.object_type,
      })
      .getOne();
    const data = { seo: {}, og: {}, twitter: {} };
    if (seo) {
      (data.seo = {
        pageTitle: seo.page_title,
        title: seo.meta_title,
        description: seo.meta_description,
        keywords: seo.seoKeyword,
        author: '1851franchise',
        robots: 'index,follow',
        indexable: true,
        referrer: 'no-referrer-when-downgrade',
      }),
        (data.og = {
          title: seo.meta_title,
          description: seo.meta_description,
        }),
        (data.twitter = {
          title: seo.meta_title,
          description: seo.meta_description,
        });
    }
    return { data };
  }
}
