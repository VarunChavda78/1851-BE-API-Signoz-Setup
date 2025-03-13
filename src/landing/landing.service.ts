import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { LpLeadsRepository } from './lp-leads.repository';
import { CreateLeadDto } from './dtos/createLeadDto';
import { LpLeads } from './lp-leads.entity';
import { S3Service } from 'src/s3/s3.service';
import { CommonService } from 'src/shared/services/common.service';
import * as moment from 'moment-timezone';
import { LeadsFilterDto } from './dtos/leadsFilterDto';
import { createObjectCsvStringifier } from 'csv-writer';
import { VerifyCaptchaService } from 'src/shared/services/verify-captcha.service';
import { LpInquiryRepository } from './lp-inquiry.repository';
import { UpdateLpInquiryDto } from './dtos/lpInquiryDto';
import { LpCrmFormRepository } from './lp-form.repository';
import { Not, IsNull } from 'typeorm';

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
    private readonly lpLeadsRepository: LpLeadsRepository,
    private lpInquiryRepository: LpInquiryRepository,
    private lpCrmFormRepository: LpCrmFormRepository,
    private s3Service: S3Service,
    private envService: EnvironmentConfigService,
    private commonService: CommonService,
    private verifyCaptchaService: VerifyCaptchaService,
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
        'lp_page.nameSlug',
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
      nameSlug: page.nameSlug,
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
      url1:
        page.domainType == DomainType.SUBDOMAIN
          ? `https://${page.nameSlug}.${this.config
              .getFEUrl()
              ?.replace('https://', '')}`
          : page.domainType == DomainType.CUSTOM_DOMAIN
            ? `https://${page.domain}`
            : '-',
    };
  }
  async createPage(
    slug: string,
    createPageDto: { name: string; templateId: number, nameSlug?: string },
    brandId: number,
    userId: number,
  ) {
    const timestamp = new Date();
    if (!createPageDto?.nameSlug) {
      createPageDto.nameSlug = createPageDto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
    }
    // Check if page with nameSlug already exists
    const existingPage = await this.lpPageRepository.findOne({
      where: { nameSlug: createPageDto.nameSlug },
    });

    if (existingPage) {
      throw new BadRequestException(`Page with nameSlug ${createPageDto.nameSlug} already exists`);
    }
    const newPage = this.lpPageRepository.create({
      brandId,
      name: createPageDto.name,
      nameSlug: createPageDto.nameSlug,
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
  async editPage(
    editPageDto: { name: string; templateId: number, nameSlug?: string , lpId: number },
    brandId: number,
    userId: number,
  ) {
    const timestamp = new Date();
    if (!editPageDto?.nameSlug) {
      editPageDto.nameSlug = editPageDto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
    }
    const page = await this.lpPageRepository.findOne({
      where: { id: editPageDto.lpId, brandId: brandId },
    });

    if (!page) {
      throw new NotFoundException(`Page not found with ID: ${editPageDto.lpId}`);
    }
    const isUnique = await this.checkUniqueNameSlug(editPageDto.nameSlug);
    if (!isUnique) {
      throw new BadRequestException(`Page with nameSlug ${editPageDto.nameSlug} already exists`);
    }
    page.name = editPageDto.name;
    page.nameSlug = editPageDto.nameSlug;
    page.updatedAt = timestamp;
    page.updatedBy = userId;

    return await this.lpPageRepository.save(page);
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

  async publishedContent(lpId: number) {
    try {
      const existingPage = await this.lpCustomisationRepository.find({
        where: { landingPageId: lpId },
      });

      if (!existingPage) {
        throw new Error(`Page with ID ${lpId} not found`);
      }

      const updatedPages = existingPage.map((page) => {
        page.publishedContent = page.content;
        page.updatedAt = new Date();
        return page;
      });

      await this.lpCustomisationRepository.save(updatedPages);

      return {
        message: `updated successfully`,
      };
    } catch (error) {
      console.error(error);
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
      const totalPublishedPages = await this.lpPageRepository.count({
        where: { brandId, status: PageStatus.PUBLISH, deletedAt: IsNull() },
      });
      const totalPagesAllowed = await this.lpSettingsRepository.findOne({
        where: { brandId },
        select: ['noOfPages'],
      });
      const existingPublish = await this.lpPageRepository.findOne({
        where: { id: lpId, brandId },
      });
      // If existingPublish and user is trying to change the domainType, then allow them
      
      // if (publishDto.publishStatus && totalPublishedPages >= totalPagesAllowed?.noOfPages) {
      //   throw new BadRequestException('Maximum number of published pages reached');
      // }
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

  async publishStatus(slug: string, lpId?: number) {
    const brand = await this.usersService.getBrandIdBySlug(slug);
    if (!brand) {
      throw new Error(`Brand not found for slug: ${slug}`);
    }
    const data = await this.lpPageRepository.find({
      where: { brandSlug: slug, status: PageStatus.PUBLISH, id: lpId || Not(IsNull()) },
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
        approved: brand.status === 'approve',
      };
    return {
      publishStatus: false,
      page: null,
      approved: brand.status === 'approve',
    };
  }

  async publishStatusV2(slug: string) {

    const data = await this.lpPageRepository.find({
      where: { nameSlug: slug, status: PageStatus.PUBLISH },
    });
    if (!data || data.length === 0) {
       throw new Error(`No published pages found for slug: ${slug}`);
        }
    const brand = await this.usersService.getBrandIdBySlug(data[0]?.brandSlug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
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
          brandSlug: data[0]?.brandSlug,
        },
        approved: brand.status === 'approve'
      };
    return {
      publishStatus: false,
      page: null,
      approved: brand.status === 'approve'
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
      noOfPages: settings ? settings.noOfPages : 1,
      templateConfig: settings ? settings.templateConfig : {},
    };
  }

  async updateLandingPageStatus(
    slug: string,
    status: boolean,
    userId: number,
    body: any,
  ) {
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
      settings.templateConfig = body?.templateConfig || {};
      settings.noOfPages = body?.noOfPages || 1;
    } else {
      settings = this.lpSettingsRepository.create({
        brandId: brand.id,
        status,
        createdBy: userId,
        updatedBy: userId,
        templateConfig: body.templateConfig,
        noOfPages: body.noOfPages,
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
      if (leadDataDto?.formType !== 2) {
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
      }

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
      const inquiryEmails = await this.getInquiryEmails(
        leadDataDto.lpId,
        brandId,
      );
      // Handle emails based on form type
      if (leadDataDto.formType === 2) {
        // PDF download case
        await this.leadsUtilService.sendPdfEmailToBrand(
          { email: leadDataDto.email },
          brand,
          inquiryEmails?.email,
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
          this.leadsUtilService.sendEmailToBrand(
            leadForEmail,
            brand,
            inquiryEmails?.email,
          ),
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

  async getLpLeads(
    brandId: number,
    filterDto?: LeadsFilterDto | null,
    csv: boolean = false,
  ) {
    try {
      const limit =
        filterDto?.limit && filterDto.limit > 0 ? Number(filterDto.limit) : 10;
      const page =
        filterDto?.page && filterDto.page > 0 ? Number(filterDto.page) : 1;
      const skip = (page - 1) * limit;
      const sort = filterDto?.sort || 'createdAt';
      const order: 'ASC' | 'DESC' =
        filterDto?.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      let query = this.lpLeadsRepository
        .createQueryBuilder('lead')
        .select('lead.uid')
        .addSelect('MAX(lead.createdAt)', 'createdAt')
        .addSelect('MAX(lead.formType)', 'formType')
        .where('lead.brandId = :brandId', { brandId })
        .andWhere('lead.deletedAt IS NULL')
        .groupBy('lead.uid');

      if (filterDto && filterDto.q) {
        query = query.andWhere((qb) => {
          const searchTerms = filterDto.q
            .split(' ')
            .filter((term) => term.length > 0);
          const subQuery = qb
            .subQuery()
            .select('s.uid')
            .from(LpLeads, 's')
            .where('s.brandId = :brandId', { brandId });

          searchTerms.forEach((term, index) => {
            subQuery.andWhere(`LOWER(s.value) LIKE LOWER(:search${index})`, {
              [`search${index}`]: `%${term}%`,
            });
          });

          return 'lead.uid IN ' + subQuery.getQuery();
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
        query = query.orderBy(
          'MAX(lead.formType)',
          order === 'ASC' ? 'DESC' : 'ASC',
        );
      } else {
        // For other fields, join with the same table to get sort field values
        query = query
          .leftJoin(
            'lp_leads',
            'sort_data',
            'sort_data.uid = lead.uid AND sort_data.field = :sortField AND sort_data.brandId = :brandId AND sort_data.deletedAt IS NULL',
            { sortField: sort, brandId },
          )
          .addSelect('MAX(sort_data.value)', 'sort_value')
          .orderBy('MAX(sort_data.value)', order, 'NULLS LAST');
      }

      if (sort !== 'createdAt') {
        query = query.addOrderBy('MAX(lead.createdAt)', 'DESC');
      }

      const totalCount = await totalQuery.getRawOne();
      const total = parseInt(totalCount.count);

      if (!csv) {
        query = query.offset(skip).limit(limit);
      }

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

        // First, create an object with required fields initialized as null
        const priorityFields = {
          firstName: null,
          lastName: null,
          email: null,
          phone: null,
        };

        // Then create an object for other fields
        const otherFields = {};

        // Populate both objects from lead fields
        leadFields.forEach((lead) => {
          if (lead.field in priorityFields) {
            priorityFields[lead.field] = lead.value;
          } else {
            otherFields[lead.field] = lead.value;
          }
        });

        // Combine objects in desired order with metadata
        return {
          ...priorityFields,
          ...otherFields,
          createdAt: moment(leadFields[0]?.createdAt)
            .tz('America/Chicago')
            .format('YYYY-MM-DD HH:mm:ss'),
          formType:
            leadFields[0]?.formType === 1 ? 'Inquiry Form' : 'Download PDF',
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

  async exportToCsv(brandId: number) {
    try {
      // Get unique fields excluding the ones we don't want in CSV
      const uniqueFields = await this.lpLeadsRepository
        .createQueryBuilder('lead')
        .select('DISTINCT lead.field', 'field')
        .where('lead.brandId = :brandId', { brandId })
        .andWhere('lead.deletedAt IS NULL')
        .andWhere('lead.field NOT IN (:...excludeFields)', {
          excludeFields: ['id', 'brandId', 'uid', 'deletedAt', 'lpId', 'type'],
        })
        .getRawMany();

      // Priority fields that should come first
      const priorityFields = ['firstName', 'lastName', 'email', 'phone'];

      // Create headers with priority fields first
      const headers = [
        ...priorityFields.map((field) => ({
          id: field,
          title: this.leadsUtilService.formatFieldName(field),
        })),
        ...uniqueFields
          .filter(({ field }) => !priorityFields.includes(field))
          .map(({ field }) => ({
            id: field,
            title: this.leadsUtilService.formatFieldName(field),
          })),
        { id: 'createdAt', title: 'Submitted Date' },
        { id: 'formType', title: 'Form Type' },
      ];

      const csvStringifier = createObjectCsvStringifier({ header: headers });

      // Get all leads data
      const { data: leadsData } = await this.getLpLeads(brandId, null, true);

      const csvHeader = csvStringifier.getHeaderString();
      const csvRecords = csvStringifier.stringifyRecords(leadsData);
      const csvData = `${csvHeader}${csvRecords}`;
      const filename = `landing_leads_${Date.now()}.csv`;

      const uploadResult = await this.s3Service.uploadCsvToS3(
        csvData,
        filename,
        'landing-lead-exports/',
        '1851',
      );

      return {
        message: 'CSV file uploaded successfully',
        url: uploadResult.url,
        name: filename,
      };
    } catch (error) {
      throw new Error(`Failed to export CSV: ${error.message}`);
    }
  }

  async updateOrCreateInquiry(lpId, brandId, emails) {
    if (!emails) return { data: null };
    // Find the existing record
    const existingInquiry = await this.lpInquiryRepository.findOne({
      where: {
        lpId,
        brandId,
      },
    });

    // Convert array of emails to comma-separated string
    const emailString = emails.join(',');

    let result;
    let isNewRecord = false;

    if (!existingInquiry) {
      // Create new record
      const newInquiry = this.lpInquiryRepository.create({
        lpId,
        brandId,
        email: emailString,
      });
      result = await this.lpInquiryRepository.save(newInquiry);
      isNewRecord = true;
    } else {
      // Update existing record
      existingInquiry.email = emailString;
      result = await this.lpInquiryRepository.save(existingInquiry);
    }

    return {
      data: result,
    };
  }

  private emailStringToArray(emailString: string): string[] {
    return emailString ? emailString.split(',') : [];
  }

  async getInquiryEmails(lpId: number, brandId: number): Promise<any> {
    const inquiry = await this.lpInquiryRepository.findOne({
      where: { lpId, brandId },
    });
    if (!inquiry) {
      return null;
    }

    return {
      ...inquiry,
      email: this.emailStringToArray(inquiry.email),
    };
  }

  async getLpCrmForm(lpId: number, brandId: number) {
    try {
      const form = await this.lpCrmFormRepository.findOne({
        where: {
          lpId,
          brandId,
        },
        select: ['id', 'content'],
      });

      if (!form) {
        throw new NotFoundException('Form not found');
      }

      return form;
    } catch (error) {
      throw error;
    }
  }

  async createOrUpdateLpCrmForm(lpId: number, brandId: number, content) {
    const existingForm = await this.lpCrmFormRepository.findOne({
      where: {
        lpId,
        brandId,
      },
    });

    if (existingForm) {
      existingForm.content = content;
      return await this.lpCrmFormRepository.save(existingForm);
    }

    const newForm = this.lpCrmFormRepository.create({
      lpId,
      brandId,
      content,
    });

    return await this.lpCrmFormRepository.save(newForm);
  }

  async checkLandingBrand(brandId: number) {
    try {
      const data = await this.usersService.checkLandingBrand(brandId);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getLandingBrandStatus(slug: string) {
    const brand = await this.usersService.getBrandIdBySlug(slug);
    if (!brand) {
      throw new Error(`Brand not found for slug: ${slug}`);
    }

    const settings = await this.usersService.checkLandingBrand(brand.id);
    return {
      isEnabled: settings ? settings.isLandingBrand : false,
    };
  }

  async updateLandingBrandStatus(slug: string, status: boolean) {
    const brand = await this.usersService.getBrandIdBySlug(slug);
    if (!brand) {
      throw new Error(`Brand not found for slug: ${slug}`);
    }

    let settings = await this.usersService.updateLandingBrandStatus(
      brand.id,
      status,
    );
    return {
      message: status
        ? 'Landing Brand enabled successfully'
        : 'Landing Brand promoted successfully',
    };
  }
  async getTemplateSubDomainPublishedBrand(
    currentStatus: number,
    domain: number,
    templateName: string,
  ) {
    try {

      const data = await this.lpPageRepository.find({
        where: {
          status: currentStatus,
          domainType: domain,
          nameSlug: templateName,
          deletedAt: IsNull(),
        },
      });
      let baseUrl = `https://${templateName}.${this.config.getFEUrl()?.replace('https://', '')}`;
      let url = [
        `${baseUrl}`,
        `${baseUrl}/services`,
        `${baseUrl}/what-is-franchising`,
        `${baseUrl}/meet-the-team`,
      ];

      for (let i = 0; i < data.length; i++) {
        if (data[i].templateId == 1) {
          const dataUrl = await this.findSection(data[i].id, 't1-pageTitle');
          if (!dataUrl) {
            (data[i] as any).urls = [...url];
          } else {
            (data[i] as any).urls = [
              `${baseUrl}`,
              `${baseUrl}${
                dataUrl.content[1].url
              }`,
              `${baseUrl}${
                dataUrl.content[2].url
              }`,
              `${baseUrl}${
                dataUrl.content[3].url
              }`,
            ];
          }
        } else {
          (data[i] as any).urls = [
            `${baseUrl}`,
          ];
        }
      }
      return data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
  async getSiteMapXml(data: any, templateName: string) {
    try {
      let baseUrl = `https://${templateName}.${this.config.getFEUrl()?.replace('https://', '')}`;
      let urlContent = '<?xml version="1.0" encoding="UTF-8"?>';
      urlContent +=
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      data.forEach((entry) => {
        entry.urls.forEach((url: any) => {
          urlContent += `
    <url>
<loc>${url}</loc>
<lastmod>${entry.updatedAt}</lastmod>
<priority>${
            url ===
            `${baseUrl}`
              ? 1
              : 0.9
          }</priority>
    </url>`;
        });
      });
      urlContent += '</urlset>';
      return urlContent;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
  async getLandingPageIdAndBrandSlugBasedOnNameSlug(nameSlug: string, custom: boolean = false) {
    // If custom is true, check page based on domainType 2 and nameSlug is domain
    let page;
    if (custom) {
      page = await this.lpPageRepository.findOne({
        where: { domainType: 2, domain: nameSlug },
      });
    }
    else {
      page = await this.lpPageRepository.findOne({
        where: { nameSlug },
      });
    }

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return {
      lpId: page.id,
      brandSlug: page.brandSlug,
    };
  }
  async checkUniqueNameSlug(nameSlug: string) {
    const page = await this.lpPageRepository.findOne({
      where: { nameSlug },
    });

    if (!page) {
      return true;
    } else {
      return false;
    }
  }

  async getLpGaCode(lpId: number, brandId: number) {
    try {
      const landingPage = await this.lpPageRepository.findOne({
        where: {
          id: lpId,
          brandId,
        },
        select: ['id', 'gaCode'],
      });
  
      if (!landingPage) {
        throw new NotFoundException('Landing page not found');
      }
  
      return { id: landingPage.id, gaCode: landingPage.gaCode };
    } catch (error) {
      throw error;
    }
  }
  
  async updateLpGaCode(lpId: number, brandId: number, gaCode: string, userId: number) {
    try {
      const landingPage = await this.lpPageRepository.findOne({
        where: {
          id: lpId,
          brandId,
        },
      });
  
      if (!landingPage) {
        throw new NotFoundException('Landing page not found');
      }
  
      landingPage.gaCode = gaCode;
      landingPage.updatedBy = userId;
  
      await this.lpPageRepository.save(landingPage);
  
      return { id: landingPage.id, gaCode: landingPage.gaCode };
    } catch (error) {
      throw error;
    }
  }
  
}
