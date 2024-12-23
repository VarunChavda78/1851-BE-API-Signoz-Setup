import { Injectable } from '@nestjs/common';
import { LpPageRepository } from './lp-page.repository';
import { UsersService } from 'src/users/users.service';
import { PageStatus, PageStatusName } from './landing.constant';

@Injectable()
export class LandingService {
  constructor(
    private readonly lpPageRepository: LpPageRepository,
    private readonly usersService: UsersService,
  ) {}

  async getPagesBySlug(slug: string) {
    const brand = await this.usersService.getBrandIdBySlug(slug);
    if (!brand) {
      throw new Error(`Brand not found for slug: ${slug}`);
    }
    const pages = await this.lpPageRepository
      .createQueryBuilder('lp_page')
      .leftJoinAndSelect('lp_page.template', 'template')
      .where('lp_page.brandId = :brandId', { brandId: brand?.id })
      .select([
        'lp_page.id',
        'lp_page.name',
        'lp_page.templateId',
        'lp_page.status',
        'lp_page.brandSlug',
        'lp_page.domain',
        'template.name AS template_name', 
      ])
      .getRawMany();

      console.log('mmm pages', pages)

    return pages.map((page) => ({
      id: page.lp_page_id,
      name: page.lp_page_name,
      templateType: page.template_name, 
      status: PageStatusName[page.lp_page_status],
      url: page.lp_page_domain,
    }));
  }

  // async createPage(
  //   slug: string,
  //   createPageDto: { name: string; templateId: number },
  // ) {
  //   const brand = await this.usersService.getBrandIdBySlug(slug);
  //   if (!brand) {
  //     throw new Error(`Brand not found for slug: ${slug}`);
  //   }

  //   const timestamp = new Date();

  //   const newPage = this.lpPageRepository.create({
  //     brandId: brand.id,
  //     name: createPageDto.name,
  //     brandSlug: slug,
  //     templateId: createPageDto.templateId,
  //     status: PageStatus.DRAFT,
  //     updatedBy: 1,
  //     createdBy: 1,
  //     createdAt: timestamp,
  //     updatedAt: timestamp,
  //     deletedAt: null,
  //   });

  //   return await this.lpPageRepository.save(newPage);
  // }
}
