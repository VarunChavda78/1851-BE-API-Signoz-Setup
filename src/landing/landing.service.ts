import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { v4 as uuid } from 'uuid';
import { VerifyCaptchaService } from 'src/shared/services/verify-captcha.service';
import { LpLeadsRepository } from './lp-leads.repository';
import { CreateLeadDto } from './dtos/createLeadDto';
import { LpLeads } from './lp-leads.entity';
import { LeadsFilterDto } from './dtos/leadsFilterDto';
import { CommonService } from 'src/shared/services/common.service';

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
    private verifyCaptchaService: VerifyCaptchaService,
    private readonly lpLeadsRepository: LpLeadsRepository,
    private readonly commonService: CommonService
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
      if (pdfDto?.email) {
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

    const settings = await this.lpSettingsRepository.findOne({
      where: { brandId: brand.id },
    });
    return {
      isEnabled: settings ? settings.status : false,
    };
  }

  async updateLandingPageStatus(slug: string, status: boolean, userId: number) {
    const brand = await this.usersService.getBrandIdBySlug(slug);
    if (!brand) {
      throw new Error(`Brand not found for slug: ${slug}`);
    }

    let settings = await this.lpSettingsRepository.findOne({
      where: { brandId: brand.id },
    });

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
      message: status
        ? 'Landing page enabled successfully'
        : 'Landing page disabled successfully',
    };
  }

  async createLpLead(
    brandId: number,
    slug: string,
    leadDataDto: CreateLeadDto,
  ): Promise<any> {
    try {
      // Verify reCAPTCHA
      const recaptcha = await this.verifyCaptchaService.verifyCaptcha(
        leadDataDto?.gReCaptchaToken,
      );

      if (!recaptcha) {
        return {
          status: false,
          message: 'Invalid Captcha response',
        };
      }

      // Remove captcha token from data
      delete leadDataDto?.gReCaptchaToken;

      // Generate unique ID for this submission
      const uid = uuid();

      let leadFields;

      if (leadDataDto.formType === 2) {
        // Handle PDF download case
        leadFields = [
          {
            brandId,
            lpId: leadDataDto.lpId || 1,
            uid,
            field: 'email',
            value: leadDataDto.email,
            type: leadDataDto.type || 1,
            formType: 2, // PDF form type
          },
        ];
      } else {
        // Handle regular lead case
        leadFields = Object.entries(leadDataDto)
          .filter(
            ([key, value]) =>
              value != null &&
              key !== 'type' &&
              key !== 'formType' &&
              key !== 'gReCaptchaToken' &&
              key !== 'lpId',
          )
          .map(([field, value]) => ({
            brandId,
            lpId: leadDataDto.lpId || 1,
            uid,
            field,
            value: String(value),
            type: leadDataDto.type || 1,
            formType: leadDataDto.formType || 1,
          }));
      }

      // Create and save all fields
      const savedLeads = await this.lpLeadsRepository.save(leadFields);

      // Get brand details for email
      const brand = await this.usersService.getBrandDetails(brandId);

      // Transform saved leads back to flat object for email service
      const leadForEmail = savedLeads.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.field]: curr.value,
        }),
        {},
      );

      // Handle emails based on form type
      if (leadDataDto.formType === 2) {
        // PDF download case
        await this.leadsUtilService.sendPdfEmailToBrand(
          { email: leadDataDto.email },
          brand,
        );

        // Get PDF content if slug is provided
        if (slug) {
          const data = await this.lpPageRepository.find({
            where: { brandSlug: slug, status: PageStatus.PUBLISH },
          });

          const res = data?.filter((item) => !item.deletedAt);

          if (res[0]) {
            const page = await this.findSection(res[0].id, 't2-download-pdf');
            return {
              status: true,
              id: uid,
              message: 'PDF lead has been added successfully',
              pdf: page?.content?.pdf,
            };
          }
        }
      } else {
        // Regular lead case
        await Promise.all([
          this.leadsUtilService.sendEmailToUser(leadForEmail, brand),
          this.leadsUtilService.sendEmailToBrand(leadForEmail, brand),
        ]);
      }

      return {
        status: true,
        id: uid,
        message:
          leadDataDto.formType === 2
            ? 'PDF lead has been added successfully'
            : 'Lead has been added successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteLpLead(brandId: number, uid: string): Promise<any> {
    try {
      const existingLeads = await this.lpLeadsRepository
        .createQueryBuilder('lead')
        .where('lead.brandId = :brandId', { brandId })
        .andWhere('lead.uid = :uid', { uid })
        .andWhere('lead.deletedAt IS NULL')
        .getCount();

      if (existingLeads === 0) {
        throw new NotFoundException(`No leads found for the given identifier`);
      }

      const result = await this.lpLeadsRepository
        .createQueryBuilder('lead')
        .softDelete()
        .where('brandId = :brandId', { brandId })
        .andWhere('uid = :uid', { uid })
        .execute();
      if (result.affected === 0) {
        throw new NotFoundException(`No leads found for the given identifier`);
      }
      return {
        status: true,
        message: 'Lead deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete leads');
    }
  }

  async getLpLeads(brandId: number, filterDto: LeadsFilterDto) {
    try {
      const limit =
        filterDto?.limit && filterDto.limit > 0 ? Number(filterDto.limit) : 10;
      const page =
        filterDto?.page && filterDto.page > 0 ? Number(filterDto.page) : 1;
      const skip = (page - 1) * limit;
      const sort = filterDto?.sort || 'createdAt';
      const order: 'ASC' | 'DESC' =
        filterDto?.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      let query = this.lpLeadsRepository
        .createQueryBuilder('lead')
        .select('lead.uid')
        .addSelect('MAX(lead.createdAt)', 'createdAt')
        .addSelect('MAX(lead.formType)', 'formType')
        .where('lead.brandId = :brandId', { brandId })
        .andWhere('lead.deletedAt IS NULL')
        .groupBy('lead.uid');

      
      if (filterDto.q) {
        query = query.andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('s.uid')
            .from(LpLeads, 's')
            .where('s.brandId = :brandId', { brandId })
            .andWhere('LOWER(s.value) LIKE LOWER(:search)', {
              search: `%${filterDto.q}%`,
            })
            .getQuery();
          return 'lead.uid IN ' + subQuery;
        });
      }

      const totalQuery = this.lpLeadsRepository
            .createQueryBuilder('lead')
            .select('COUNT(DISTINCT lead.uid)', 'count')
            .where('lead.brandId = :brandId', { brandId })
            .andWhere('lead.deletedAt IS NULL');

      if (sort === 'createdAt') {
        query = query.orderBy('MAX(lead.createdAt)', order);
      } else if (sort === 'formType') {
        query = query.orderBy('MAX(lead.formType)', order);
      } else {
        query = query
          .leftJoin(
            (qb) =>
              qb
                .select('s.uid')
                .addSelect('s.value')
                .from(LpLeads, 's')
                .where('s.field = :sortField', { sortField: sort }),
            'sort_value',
            'sort_value.uid = lead.uid',
          )
          .orderBy('sort_value.value', order, 'NULLS LAST');
      }

      if (sort !== 'createdAt') {
        query = query.addOrderBy('MAX(lead.createdAt)', 'DESC');
      }

      const totalCount = await totalQuery.getRawOne();
        const total = parseInt(totalCount.count);

      query = query.offset(skip).limit(limit);

      const uidResults = await query.getRawMany();
      const uids = uidResults.map((result) => result.lead_uid);

      if (uids.length === 0) {
        return {
          data: [],
          pagination: this.commonService.getPagination(0, limit, page),
        };
      }

      const leadsQuery = this.lpLeadsRepository
        .createQueryBuilder('lead')
        .where('lead.brandId = :brandId', { brandId })
        .andWhere('lead.uid IN (:...uids)', { uids })
        .andWhere('lead.deletedAt IS NULL')
        .orderBy('lead.uid', 'ASC')
        .addOrderBy('lead.field', 'ASC');

      const leads = await leadsQuery.getMany();

      const transformedLeads = uids.map((uid) => {
        const leadFields = leads.filter((lead) => lead.uid === uid);
        const leadData = leadFields.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.field]: curr.value,
            createdAt: curr.createdAt,
            formType: curr.formType,
          }),
          {},
        );

        return {
          ...leadData,
          uid,
        };
      });

      const pagination = this.commonService.getPagination(total, limit, page);

      return {
        data: transformedLeads,
        pagination,
      };
    } catch (error) {
      throw error;
    }
  }
}
