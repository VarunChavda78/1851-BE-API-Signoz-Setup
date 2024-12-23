import { Injectable, NotFoundException } from '@nestjs/common';
import { LpPageRepository } from './lp-page.repository';
import { UsersService } from 'src/users/users.service';
import { PageStatus, PageStatusName } from './landing.constant';
import { LpTemplate } from './lp-template.entity';
import { LpSectionRepository } from './lp-section.repository';
import { LpCustomisationRepository } from './lp-customisation.repository';
import { PageOptionsDto } from './dtos/pageOptionsDto';
import { PageMetaDto } from 'src/shared/dtos/pageMetaDto';
import { PageDto } from 'src/shared/dtos/pageDto';
import { DomainType } from 'src/shared/constants/constants';
import { EnvironmentConfigService } from 'src/shared/config/environment-config.service';

@Injectable()
export class LandingService {
  constructor(
    private readonly lpPageRepository: LpPageRepository,
    private readonly usersService: UsersService,
    private readonly lpSectionRepository: LpSectionRepository,
    private readonly lpCustomisationRepository: LpCustomisationRepository,
    private readonly config: EnvironmentConfigService,
  ) {}

  async getPagesBySlug(slug: string, pageOptions: PageOptionsDto) {
    const {
      page = 1,
      limit = 10,
      order = 'DESC',
      sort = 'id',
    }: any = pageOptions;
    const skip = (page - 1) * limit;

    const brand = await this.usersService.getBrandIdBySlug(slug);
    if (!brand) {
      throw new Error(`Brand not found for slug: ${slug}`);
    }
    const queryBuilder = await this.lpPageRepository
      .createQueryBuilder('lp_page')
      .leftJoinAndSelect('lp_page.template', 'template')
      .where('lp_page.brandId = :brandId', { brandId: brand?.id })
      .andWhere('lp_page.deletedAt IS NULL')
      .select([
        'lp_page.id',
        'lp_page.name',
        'lp_page.templateId',
        'lp_page.status',
        'lp_page.brandSlug',
        'lp_page.domain',
        'lp_page.deletedAt',
        'template.name AS template_name',
      ]);
    const itemCount = await queryBuilder.getCount();
    const validOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const lpPages = await queryBuilder
      .orderBy(`lp_page.${sort}`, validOrder)
      .skip(skip)
      .take(limit)
      .getMany();
    const details = [];
    if (lpPages.length) {
      for (const data of lpPages) {
        details.push(await this.getDetails(data));
      }
    }

    const pageOptionsDto = {
      page,
      limit,
    };
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(details, pageMetaDto);
  }
  async getDetails(page) {
    return {
      id: page.id,
      name: page.name,
      templateType: page.template_name,
      status: PageStatusName[page.status],
      url:
        page.domainType == DomainType.SUBDOMAIN
          ? this.config.getFEUrl()
          : page.domain,
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
