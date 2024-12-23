import { Injectable, NotFoundException } from '@nestjs/common';
import { LpPageRepository } from './lp-page.repository';
import { UsersService } from 'src/users/users.service';
import { PageStatus, PageStatusName } from './landing.constant';
import { LpTemplate } from './lp-template.entity';
import { LpSectionRepository } from './lp-section.repository';
import { LpCustomisationRepository } from './lp-customisation.repository';

@Injectable()
export class LandingService {
  constructor(
    private readonly lpPageRepository: LpPageRepository,
    private readonly usersService: UsersService,
    private readonly lpSectionRepository: LpSectionRepository,
    private readonly lpCustomisationRepository: LpCustomisationRepository,
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

  async findSection(lpId: number, sectionSlug: string) {
    try {
      const section = await this.lpSectionRepository.findOne({
        where: { slug: sectionSlug },
      });

      if (!section) {
        throw new Error(`Section not found for slug: ${sectionSlug}`);
      }

      const customization = await this.lpCustomisationRepository.findOne({
        where: { landingPageId: lpId, section: { id: section.id } },
      });
      return customization;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async createOrUpdateSection(
    slug: string,
    lpId: number,
    sectionSlug: string,
    createLandingPageDto: any,
  ) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      const section = await this.lpSectionRepository.findOne({
        where: { slug: sectionSlug },
      });

      if (!section) {
        throw new Error(`Section not found for slug: ${sectionSlug}`);
      }

      const existingPage = await this.findSection(lpId, sectionSlug);
      const timestamp = new Date();

      if (existingPage) {
        // Update existing customization
        existingPage.content = createLandingPageDto?.data || '';
        existingPage.updatedAt = timestamp;
        return {
          page: await this.lpCustomisationRepository.save(existingPage),
          message: 'Customization content updated successfully',
        };
      } else {
        // Create new customization
        const newPage = this.lpCustomisationRepository.create({
          landingPageId: lpId,
          section: section,
          content: createLandingPageDto?.data || '',
          createdBy: 1,
          updatedBy: 1,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        return {
          page: await this.lpCustomisationRepository.save(newPage),
          message: 'Customization content created successfully',
        };
      }
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
}
