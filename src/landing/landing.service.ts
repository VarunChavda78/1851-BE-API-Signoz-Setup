import { Injectable, NotFoundException } from '@nestjs/common';
import { LpPageRepository } from './lp-page.repository';
import { UsersService } from 'src/users/users.service';
import { PageStatus, PageStatusName } from './landing.constant';
import { LpTemplate } from './lp-template.entity';

@Injectable()
export class LandingService {
  constructor(
    private readonly lpPageRepository: LpPageRepository,
    private readonly usersService: UsersService,
  ) {}

  async getPagesBySlug(
    slug: string,
    options: {
      sort?: string;
      order?: 'ASC' | 'DESC';
      limit?: number;
      page?: number;
    },
  ) {
    const { sort = 'id', order = 'ASC', limit = 20, page = 1 } = options;

    const brand = await this.usersService.getBrandIdBySlug(slug);
    if (!brand) {
      throw new Error(`Brand not found for slug: ${slug}`);
    }

    const query = this.lpPageRepository
      .createQueryBuilder('lp_page')
      .leftJoinAndMapOne(
        'lp_page.template',
        LpTemplate,
        'template',
        'template.id = lp_page.templateId',
      )
      .where('lp_page.brandId = :brandId', { brandId: brand.id })
      .andWhere('lp_page.deletedAt IS NULL');

    const totalRecords = await query.getCount();
    const pages = await query
      .orderBy(`lp_page.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const formattedPages = pages.map((page) => ({
      id: page.id,
      name: page.name,
      templateType: page?.template?.name,
      status: PageStatus[page.status],
      url: page.domain || '',
    }));

    return {
      data: formattedPages,
      totalRecords,
    };
  }

  async createPage(
    slug: string,
    createPageDto: { name: string; templateId: number },
  ) {
    const brand = await this.usersService.getBrandIdBySlug(slug);
    if (!brand) {
      throw new Error(`Brand not found for slug: ${slug}`);
    }

    const timestamp = new Date();

    const newPage = this.lpPageRepository.create({
      brandId: brand.id,
      name: createPageDto.name,
      brandSlug: slug,
      templateId: createPageDto.templateId,
      status: PageStatus.DRAFT,
      updatedBy: 1,
      createdBy: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
    });

    return await this.lpPageRepository.save(newPage);
  }

  async deletePage(slug: string, lpId: number) {
    const brand = await this.usersService.getBrandIdBySlug(slug);
    if (!brand) {
      throw new Error(`Brand not found for slug: ${slug}`);
    }
    const page = await this.lpPageRepository.findOne({
      where: { id: lpId, brandId: brand?.id },
    });

    if (!page) {
      throw new NotFoundException(`Page not found with ID: ${lpId}`);
    }

    // Soft delete - set the deletedAt field to the current timestamp
    page.deletedAt = new Date();

    await this.lpPageRepository.save(page);
  }
}
