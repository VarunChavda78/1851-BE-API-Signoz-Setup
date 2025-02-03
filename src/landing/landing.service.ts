import { Injectable, NotFoundException } from '@nestjs/common';
import { LpPageRepository } from './lp-page.repository';
import { UsersService } from 'src/users/users.service';
import { PageStatus, PageStatusName } from './landing.constant';
import { LpSectionRepository } from './lp-section.repository';
import { LpCustomisationRepository } from './lp-customisation.repository';
import { PageOptionsDto } from './dtos/pageOptionsDto';
import { PageMetaDto } from 'src/shared/dtos/pageMetaDto';
import { PageDto } from 'src/shared/dtos/pageDto';
import { DomainType } from 'src/shared/constants/constants';
import { EnvironmentConfigService } from 'src/shared/config/environment-config.service';
import { LpPdfRepository } from './lp-pdf.repository';
import { LpSettingsRepository } from './lp-settings.repository';
import { LeadsUtilService } from './leads-utils.service';

@Injectable()
export class LandingService {
  constructor(
    private readonly lpPageRepository: LpPageRepository,
    private readonly usersService: UsersService,
    private readonly lpSectionRepository: LpSectionRepository,
    private readonly lpCustomisationRepository: LpCustomisationRepository,
    private readonly config: EnvironmentConfigService,
    private readonly lpPdfRepository: LpPdfRepository,
    private readonly lpSettingsRepository: LpSettingsRepository,
    private readonly leadsUtilService: LeadsUtilService,
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
        'lp_page.domainType',
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
      templateId: page.templateId,
      templateType:
        page.templateId == 1
          ? 'Template 1'
          : page.templateId == 2
            ? 'Template 2'
            : 'Template 3',
      status: PageStatusName[page.status],
      url:
        page.domainType == DomainType.SUBDOMAIN
          ? `https://${page.brandSlug}.${this.config
              .getFEUrl()
              ?.replace('https://', '')}`
          : page.domainType == DomainType.CUSTOM_DOMAIN
            ? `https://${page.domain}`
            : '-',
    };
  }
  async createPage(
    slug: string,
    createPageDto: { name: string; templateId: number },
    brandId: number,
    userId: number,
  ) {
    const timestamp = new Date();

    const newPage = this.lpPageRepository.create({
      brandId,
      name: createPageDto.name,
      brandSlug: slug,
      templateId: createPageDto.templateId,
      status: PageStatus.DRAFT,
      updatedBy: userId,
      createdBy: userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
    });

    return await this.lpPageRepository.save(newPage);
  }

  async deletePage(brandId: number, lpId: number) {
    const page = await this.lpPageRepository.findOne({
      where: { id: lpId, brandId: brandId },
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
    brandId: number,
    lpId: number,
    sectionSlug: string,
    createLandingPageDto: any,
    userId: number,
  ) {
    try {
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
          createdBy: userId,
          updatedBy: userId,
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

  async UpdatePublishData(
    lpId: number,
    brandId: number,
    publishDto: any,
    slug: string,
  ) {
    try {
      const existingPublish = await this.lpPageRepository.findOne({
        where: { id: lpId, brandId },
      });

      if (existingPublish) {
        existingPublish.status = publishDto.publishStatus ? 2 : 1;
        existingPublish.customDomainStatus =
          publishDto.domainType === 'sub-domain'
            ? null
            : publishDto.customDomainStatus;
        existingPublish.domainType = publishDto.publishStatus
          ? publishDto.domainType === 'sub-domain'
            ? 1
            : 2
          : null; // Map to integer
        existingPublish.domain = publishDto.domain || null;
        (existingPublish.brandSlug = slug || null),
          (existingPublish.updatedBy = 1); // Assuming constant value for now
        const data = await this.lpPageRepository.save(existingPublish);
        return { ...data, status: data.status == 2 };
      } else {
        return existingPublish;
      }
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async getPublishData(lpId: number) {
    try {
      const data = await this.lpPageRepository.findOne({
        where: { id: lpId },
      });
      return { ...data, status: data.status == 2 };
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async publishStatus(slug: string) {
    const data = await this.lpPageRepository.find({
      where: { brandSlug: slug, status: PageStatus.PUBLISH },
    });
    const res = data?.filter((item) => {
      return !item.deletedAt;
    });
    if (res[0])
      return {
        publishStatus: true,
        page: {
          id: res[0]?.id,
          name: res[0]?.name,
          templateId: res[0]?.templateId,
        },
      };
    return {
      publishStatus: false,
      page: null,
    };
  }
  async createPdf(slug: string, brandId: number, pdfDto: any): Promise<any> {
    try {
      const newLead = this.lpPdfRepository.create({
        brandId,
        email: pdfDto.email,
      });
      await this.lpPdfRepository.save(newLead);
      if(pdfDto?.email){
        const brand = await this.usersService.getBrandDetails(brandId);
        await this.leadsUtilService.sendPdfEmailToBrand(pdfDto, brand);
      }
      const data = await this.lpPageRepository.find({
        where: { brandSlug: slug, status: PageStatus.PUBLISH },
      });
      const res = data?.filter((item) => {
        return !item.deletedAt;
      });
      if (res[0]) {
        const page = await this.findSection(res[0].id, 't2-download-pdf');
        return page?.content?.pdf;
      }
    } catch (error) {
      throw error;
    }
  }

  async getLandingPageStatus(slug: string) {
    const brand = await this.usersService.getBrandIdBySlug(slug);
    if (!brand) {
      throw new Error(`Brand not found for slug: ${slug}`);
    }

    const settings = await this.lpSettingsRepository.findOne({ where: { brandId: brand.id } });
    return {
      isEnabled: settings ? settings.status : false
    };
  }

  async updateLandingPageStatus(slug: string, status: boolean, userId: number) {
    const brand = await this.usersService.getBrandIdBySlug(slug);
    if (!brand) {
      throw new Error(`Brand not found for slug: ${slug}`);
    }

    let settings = await this.lpSettingsRepository.findOne({ where: { brandId: brand.id } });
    
    if (settings) {
      settings.status = status;
      settings.updatedBy = userId;
    } else {
      settings = this.lpSettingsRepository.create({
        brandId: brand.id,
        status,
        createdBy: userId,
        updatedBy: userId,
      });
    }

    await this.lpSettingsRepository.save(settings);

    return {
      message: status ? "Landing page enabled successfully" : "Landing page disabled successfully"
    };
  }
}
