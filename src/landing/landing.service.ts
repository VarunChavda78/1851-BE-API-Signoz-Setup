import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { S3Service } from 'src/s3/s3.service';
import { CommonService } from 'src/shared/services/common.service';
import * as moment from 'moment-timezone';
import { LandingPageLeadsRepository } from './landing-leads.repository';
import { LeadsFilterDto } from './dtos/leads-dto';
import { createObjectCsvStringifier } from 'csv-writer';
import { VerifyCaptchaService } from 'src/shared/services/verify-captcha.service';

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
    private s3Service: S3Service,
    private envService: EnvironmentConfigService,
    private commonService: CommonService,
    private readonly landingPageLeadsRepository: LandingPageLeadsRepository,
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

  async exportToCsv(brandId: number) {
    try {
      const siteId = this.envService.getSiteId() || '1851';
      const leadsQuery = this.landingPageLeadsRepository
        .createQueryBuilder('landing_page_leads')
        .select([
          'landing_page_leads.firstName',
          'landing_page_leads.lastName',
          'landing_page_leads.email',
          'landing_page_leads.createdAt',
        ])
        .where('landing_page_leads.brandId = :brandId', { brandId })
        .andWhere('landing_page_leads.deletedAt IS NULL')
        .orderBy('landing_page_leads.createdAt', 'DESC');

      const pdfQuery = this.lpPdfRepository
        .createQueryBuilder('lp_pdf')
        .select(['lp_pdf.email', 'lp_pdf.createdAt'])
        .where('lp_pdf.brandId = :brandId', { brandId })
        .andWhere('lp_pdf.deletedAt IS NULL')
        .orderBy('lp_pdf.createdAt', 'DESC');

      const [leads, pdfDownloads] = await Promise.all([
        leadsQuery.getMany(),
        pdfQuery.getMany(),
      ]);

      const transformedLeads = leads.map((lead) => ({
        ...lead,
        createdAt: moment(lead.createdAt).tz('America/Chicago').format('YYYY-MM-DD HH:mm:ss'),
        leadType: 'Inquiry Form' as const,
      }));

      const transformedPdfDownloads = pdfDownloads.map((pdf) => ({
        email: pdf.email,
        createdAt: moment(pdf.createdAt).tz('America/Chicago').format('YYYY-MM-DD HH:mm:ss'),
        leadType: 'Download Pdf' as const,
      }));

      // Combine and sort results
      const combinedResults = [
        ...transformedLeads,
        ...transformedPdfDownloads,
      ].sort((a, b) => {
        const aMoment = moment(a.createdAt, 'YYYY-MM-DD HH:mm:ss').tz('America/Chicago');
        const bMoment = moment(b.createdAt, 'YYYY-MM-DD HH:mm:ss').tz('America/Chicago');
        return bMoment.valueOf() - aMoment.valueOf();
      });

      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'firstName', title: 'First Name' },
          { id: 'lastName', title: 'Last Name' },
          { id: 'email', title: 'Email' },
          { id: 'createdAt', title: 'Submitted Date' },
          { id: 'leadType', title: 'Lead Type' },
        ],
      });
  
      const csvHeader = csvStringifier.getHeaderString();
      const csvRecords = csvStringifier.stringifyRecords(combinedResults);
      const csvData = `${csvHeader}${csvRecords}`;
  
      const filename = `landing_leads_${Date.now()}.csv`;
  
      const uploadResult = await this.s3Service.uploadCsvToS3(csvData, filename, 'landing-lead-exports/', siteId);
  
      return {
        message: 'CSV file uploaded successfully',
        url: uploadResult.url,
        name: filename
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteLead(id: number, brandId: number, leadType = 'inquiry') {
    try {
      let response;
      if (leadType === 'inquiry') {
        response = await this.landingPageLeadsRepository.softDelete({
          id,
          brandId,
        });
      } else if (leadType === 'download') {
        response = await this.lpPdfRepository.softDelete({
          id,
          brandId,
        });
      } else {
        throw new BadRequestException('Invalid lead type');
      }

      if (!response.affected) {
        throw new NotFoundException(
          `${leadType === 'inquiry' ? 'Lead' : 'PDF download'} not found`,
        );
      }

      return {
        status: true,
        message: `${
          leadType === 'inquiry' ? 'Lead' : 'PDF download'
        } deleted successfully`,
      };
    } catch (error) {
      throw error;
    }
  }
  async createLead(brandId: number, leadDataDto: any): Promise<any> {
    try {
      const recaptcha = await this.verifyCaptchaService.verifyCaptcha(
        leadDataDto?.gReCaptchaToken,
      );

      if (!recaptcha) {
        return {
          status: false,
          message: 'Invalid Captcha response',
        };
      }
      delete leadDataDto?.gReCaptchaToken;

      const newLead = this.landingPageLeadsRepository.create({
        brandId,
        firstName: leadDataDto.firstName,
        lastName: leadDataDto.lastName,
        email: leadDataDto.email,
        phone: leadDataDto.phone,
        city: leadDataDto.city,
        state: leadDataDto.state,
        zip: leadDataDto.zip,
        interest: leadDataDto.interest,
        type: leadDataDto.type,
        lookingFor: leadDataDto.lookingFor,
      });

      const lead = await this.landingPageLeadsRepository.save(newLead);
      const brand = await this.usersService.getBrandDetails(brandId);
      await this.leadsUtilService.sendEmailToUser(lead, brand);
      await this.leadsUtilService.sendEmailToBrand(lead, brand);
      return {
        status: true,
        id: lead.id,
        message: 'Lead has been added successfully',
      };
    } catch (error) {
      throw error;
    }
  }
  async getLeads(brandId: number, filterDto: LeadsFilterDto) {
    try {
      const limit =
        filterDto?.limit && filterDto.limit > 0 ? Number(filterDto.limit) : 10;
      const page =
        filterDto?.page && filterDto.page > 0 ? Number(filterDto.page) : 1;
      const skip = (page - 1) * limit;
      const orderBy = filterDto?.sort || 'createdAt';
      const order: 'ASC' | 'DESC' =
        filterDto?.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      // Base queries
      let leadsQuery = this.landingPageLeadsRepository
        .createQueryBuilder('landing_page_leads')
        .where('landing_page_leads.brandId = :brandId', { brandId })
        .andWhere('landing_page_leads.deletedAt IS NULL');

      let pdfQuery = this.lpPdfRepository
        .createQueryBuilder('lp_pdf')
        .select(['lp_pdf.id', 'lp_pdf.email', 'lp_pdf.createdAt'])
        .where('lp_pdf.brandId = :brandId', { brandId })
        .andWhere('lp_pdf.deletedAt IS NULL');

      // Apply search if provided
      if (filterDto.q) {
        const searchTerm = `%${filterDto.q}%`;
        leadsQuery = leadsQuery.andWhere(
          '(LOWER(landing_page_leads.firstName) LIKE LOWER(:search) OR LOWER(landing_page_leads.lastName) LIKE LOWER(:search) OR LOWER(landing_page_leads.email) LIKE LOWER(:search))',
          { search: searchTerm },
        );

        pdfQuery = pdfQuery.andWhere(
          'LOWER(lp_pdf.email) LIKE LOWER(:search)',
          { search: searchTerm },
        );
      }
      if (orderBy === 'leadType') {
        // For leadType sorting, we'll fetch all records and sort them in memory
        const [leads, pdfDownloads] = await Promise.all([
          leadsQuery.getMany(),
          pdfQuery.getMany(),
        ]);

        const transformedLeads = leads.map((lead) => ({
          ...lead,
          leadType: 'inquiry' as const,
        }));

        const transformedPdfDownloads = pdfDownloads.map((pdf) => ({
          id: pdf.id,
          email: pdf.email,
          createdAt: pdf.createdAt,
          leadType: 'download' as const,
        }));

        // Combine and sort by leadType
        const combinedResults = [
          ...transformedLeads,
          ...transformedPdfDownloads,
        ].sort((a, b) => {
          if (order === 'ASC') {
            return a.leadType.localeCompare(b.leadType);
          }
          return b.leadType.localeCompare(a.leadType);
        });

        // Apply pagination after sorting
        const paginatedResults = combinedResults.slice(skip, skip + limit);
        const totalRecords = combinedResults.length;

        const pagination = this.commonService.getPagination(
          totalRecords,
          limit,
          page,
        );

        return { data: paginatedResults, pagination };
      }
      // Apply ordering and pagination based on orderBy field
      else if (orderBy === 'createdAt' || orderBy === 'email') {
        // For createdAt and email, apply sorting and pagination to both queries
        leadsQuery = leadsQuery.orderBy(`landing_page_leads.${orderBy}`, order);

        pdfQuery = pdfQuery.orderBy(`lp_pdf.${orderBy}`, order);

        const [leads, pdfDownloads] = await Promise.all([
          leadsQuery.getMany(),
          pdfQuery.getMany(),
        ]);

        const transformedLeads = leads.map((lead) => ({
          ...lead,
          leadType: 'inquiry' as const,
        }));

        const transformedPdfDownloads = pdfDownloads.map((pdf) => ({
          id: pdf.id,
          email: pdf.email,
          createdAt: pdf.createdAt,
          leadType: 'download' as const,
        }));

        // Combine and sort results
        const combinedResults = [
          ...transformedLeads,
          ...transformedPdfDownloads,
        ].sort((a, b) => {
          const aValue = a[orderBy];
          const bValue = b[orderBy];
          return order === 'ASC'
            ? aValue > bValue
              ? 1
              : -1
            : aValue < bValue
              ? 1
              : -1;
        });

        const paginatedResults = combinedResults.slice(skip, skip + limit);

        // Calculate total records and pagination
        const totalRecords = combinedResults.length;
        const pagination = this.commonService.getPagination(
          totalRecords,
          limit,
          page,
        );

        return { data: paginatedResults, pagination };
      } else {
        // For other fields, sort and paginate leads first, then append PDFs
        leadsQuery = leadsQuery.orderBy(`landing_page_leads.${orderBy}`, order);

        const [leads, pdfDownloads] = await Promise.all([
          leadsQuery.getMany(),
          pdfQuery.getMany(), // Get all PDF downloads without sorting/pagination
        ]);

        const transformedLeads = leads.map((lead) => ({
          ...lead,
          leadType: 'inquiry' as const,
        }));

        const transformedPdfDownloads = pdfDownloads.map((pdf) => ({
          id: pdf.id,
          email: pdf.email,
          createdAt: pdf.createdAt,
          leadType: 'download' as const,
        }));

        // For other fields, simply append PDF downloads after leads
        const combinedResults = [
          ...transformedLeads,
          ...transformedPdfDownloads,
        ];

        const paginatedResults = combinedResults.slice(skip, skip + limit);

        // Calculate total records and pagination
        const totalRecords = combinedResults.length;
        const pagination = this.commonService.getPagination(
          totalRecords,
          limit,
          page,
        );

        return { data: paginatedResults, pagination };
      }
    } catch (error) {
      throw error;
    }
  }
}
