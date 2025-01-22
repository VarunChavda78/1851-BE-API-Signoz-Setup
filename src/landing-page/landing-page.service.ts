import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LandingPageRepository } from './landing-page.repository';
import { LandingPageSectionRepository } from './landing-page-section.repository';
import { LandingPageCustomisationRepository } from './landing-page-customisation.repository';
import { RollbarLogger } from 'nestjs-rollbar';
import { LandingPagePublishRepository } from './landing-page-publish.repository';
import { LandingPageLeadsRepository } from './landing-page-leads.repository';
import { CommonService } from 'src/shared/services/common.service';
import { LeadsFilterDto } from './dto/leads-dto';
import { VerifyCaptchaService } from 'src/shared/services/verify-captcha.service';
import { LeadsUtilService } from './leads-utils.service';
import { UsersService } from 'src/users/users.service';
import { LpPdfRepository } from 'src/landing/lp-pdf.repository';

@Injectable()
export class LandingPageService {
  private logger = new Logger('LandingPageService');
  constructor(
    private readonly landingPageRepository: LandingPageRepository,
    private readonly landingPageCustomisationRepository: LandingPageCustomisationRepository,
    private readonly landingPageSectionRepository: LandingPageSectionRepository,
    private readonly rollbarLogger: RollbarLogger,
    private readonly landingPagePublishRepository: LandingPagePublishRepository,
    private readonly landingPageLeadsRepository: LandingPageLeadsRepository,
    private commonService: CommonService,
    private verifyCaptchaService: VerifyCaptchaService,
    private leadsUtilService: LeadsUtilService,
    private readonly usersService: UsersService,
    private readonly lpPdfRepository: LpPdfRepository,
  ) {}

  async findOne(brandId: number) {
    try {
      const data = await this.landingPageRepository.findOne({
        where: { brandId },
      });
      return data;
    } catch (error) {
      this.logger.error('Error fetching brand details', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.findOne.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async createOrUpdate(brandId: number, createLandingPageDto: any) {
    try {
      const existingPage = await this.findOne(brandId);

      if (existingPage) {
        // Update existing landing page
        existingPage.content = createLandingPageDto?.content || '';
        existingPage.updatedAt = new Date(); // Set updatedAt to current timestamp
        return {
          page: await this.landingPageRepository.save(existingPage),
          message: 'Page content updated successfully',
        };
      } else {
        // Create new landing page
        const newPage = this.landingPageRepository.create({
          brandId,
          content: createLandingPageDto?.content || '',
          createdBy: 1,
          updatedBy: 1,
        });
        return {
          page: await this.landingPageRepository.save(newPage),
          message: 'Page content created successfully',
        };
      }
    } catch (error) {
      this.logger.error(`Error creating or updating landing page`, error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.createOrUpdate.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async findSection(brandId: number, sectionSlug: string) {
    try {
      const section = await this.landingPageSectionRepository.findOne({
        where: { slug: sectionSlug },
      });

      if (!section) {
        throw new Error(`Section not found for slug: ${sectionSlug}`);
      }

      const customization =
        await this.landingPageCustomisationRepository.findOne({
          where: { brandId, section: { id: section.id } },
        });
      return customization;
    } catch (error) {
      this.logger.error('Error fetching landing page section', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.findSection.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async createOrUpdateSection(
    brandId: number,
    sectionSlug: string,
    createLandingPageDto: any,
  ) {
    try {
      const section = await this.landingPageSectionRepository.findOne({
        where: { slug: sectionSlug },
      });

      if (!section) {
        throw new Error(`Section not found for slug: ${sectionSlug}`);
      }

      const existingPage = await this.findSection(brandId, sectionSlug);

      if (existingPage) {
        // Update existing customization
        existingPage.content = createLandingPageDto?.data || '';
        existingPage.updatedAt = new Date();
        return {
          page: await this.landingPageCustomisationRepository.save(
            existingPage,
          ),
          message: 'Customization content updated successfully',
        };
      } else {
        // Create new customization
        const newPage = this.landingPageCustomisationRepository.create({
          brandId,
          section,
          content: createLandingPageDto?.data || '',
          createdBy: 1,
          updatedBy: 1,
        });
        return {
          page: await this.landingPageCustomisationRepository.save(newPage),
          message: 'Customization content created successfully',
        };
      }
    } catch (error) {
      this.logger.error('Error creating or updating section', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.createOrUpdateSection.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async createOrUpdatePublish(brandId: number, publishDto: any, slug: string) {
    try {
      const existingPublish = await this.landingPagePublishRepository.findOne({
        where: { brandId },
      });

      if (existingPublish) {
        // Update existing publish record
        existingPublish.status = publishDto.publishStatus;
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
        return await this.landingPagePublishRepository.save(existingPublish);
      } else {
        // Create new publish record
        const newPublish = this.landingPagePublishRepository.create({
          brandId,
          status: publishDto.publishStatus,
          customDomainStatus:
            publishDto.domainType === 'sub-domain'
              ? null
              : publishDto.customDomainStatus,
          domainType: publishDto.domainType === 'sub-domain' ? 1 : 2, // Map to integer
          domain: publishDto.domain || null,
          brandSlug: slug || null,
          createdBy: 1, // Assuming constant value for now
          updatedBy: 1, // Assuming constant value for now
        });
        return await this.landingPagePublishRepository.save(newPublish);
      }
    } catch (error) {
      this.logger.error('Error creating or updating publish data', error);
      throw error;
    }
  }

  async getPublishData(brandId: number) {
    try {
      return await this.landingPagePublishRepository.findOne({
        where: { brandId },
      });
    } catch (error) {
      this.logger.error('Error retrieving publish data', error);
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
      this.logger.error('Error creating lead', error);
      throw error;
    }
  }

  async getLeads(brandId: number, filterDto: LeadsFilterDto) {
    try {
      const limit = filterDto?.limit && filterDto.limit > 0 ? Number(filterDto.limit) : 10;
      const page = filterDto?.page && filterDto.page > 0 ? Number(filterDto.page) : 1;
      const skip = (page - 1) * limit;
      const orderBy = filterDto?.sort || 'createdAt';
      const order: 'ASC' | 'DESC' = filterDto?.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      // Base queries
      let leadsQuery = this.landingPageLeadsRepository
        .createQueryBuilder('landing_page_leads')
        .where('landing_page_leads.brandId = :brandId', { brandId })
        .andWhere('landing_page_leads.deletedAt IS NULL');

      let pdfQuery = this.lpPdfRepository
        .createQueryBuilder('lp_pdf')
        .select(['lp_pdf.id', 'lp_pdf.email', 'lp_pdf.createdAt'])
        .where('lp_pdf.brandId = :brandId', { brandId });

      // Apply search if provided
      if (filterDto.q) {
        const searchTerm = `%${filterDto.q?.toLowerCase()}%`;
        leadsQuery = leadsQuery.andWhere(
          '(LOWER(landing_page_leads.firstName) LIKE :search OR LOWER(landing_page_leads.lastName) LIKE :search OR LOWER(landing_page_leads.email) LIKE :search)',
          { search: searchTerm },
        );

        pdfQuery = pdfQuery.andWhere(
          'LOWER(lp_pdf.email) LIKE :search',
          { search: searchTerm },
        );
      }
      if (orderBy === 'leadType') {
        // For leadType sorting, we'll fetch all records and sort them in memory
        const [leads, pdfDownloads] = await Promise.all([
          leadsQuery.getMany(),
          pdfQuery.getMany(),
        ]);

        const transformedLeads = leads.map(lead => ({
          ...lead,
          leadType: 'inquiry' as const
        }));

        const transformedPdfDownloads = pdfDownloads.map(pdf => ({
          id: pdf.id,
          email: pdf.email,
          createdAt: pdf.createdAt,
          leadType: 'download' as const
        }));

        // Combine and sort by leadType
        const combinedResults = [...transformedLeads, ...transformedPdfDownloads]
          .sort((a, b) => {
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
        leadsQuery = leadsQuery
          .orderBy(`landing_page_leads.${orderBy}`, order)
          .skip(skip)
          .take(limit);

        pdfQuery = pdfQuery
          .orderBy(`lp_pdf.${orderBy}`, order)
          .skip(skip)
          .take(limit);

        const [leads, pdfDownloads] = await Promise.all([
          leadsQuery.getMany(),
          pdfQuery.getMany(),
        ]);

        const transformedLeads = leads.map(lead => ({
          ...lead,
          leadType: 'inquiry' as const
        }));

        const transformedPdfDownloads = pdfDownloads.map(pdf => ({
          id: pdf.id,
          email: pdf.email,
          createdAt: pdf.createdAt,
          leadType: 'download' as const
        }));

        // Combine and sort results
        const combinedResults = [...transformedLeads, ...transformedPdfDownloads]
          .sort((a, b) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];
            return order === 'ASC' ? 
              (aValue > bValue ? 1 : -1) : 
              (aValue < bValue ? 1 : -1);
          })
          .slice(0, limit);

        const totalRecords = await this.getTotalCount(brandId, filterDto.q);
        const pagination = this.commonService.getPagination(
          totalRecords,
          limit,
          page,
        );

        return { data: combinedResults, pagination };
      } else {
        // For other fields, sort and paginate leads first, then append PDFs
        leadsQuery = leadsQuery
          .orderBy(`landing_page_leads.${orderBy}`, order)
          .skip(skip)
          .take(limit);

        const [leads, pdfDownloads] = await Promise.all([
          leadsQuery.getMany(),
          pdfQuery.getMany(), // Get all PDF downloads without sorting/pagination
        ]);

        const transformedLeads = leads.map(lead => ({
          ...lead,
          leadType: 'inquiry' as const
        }));

        const transformedPdfDownloads = pdfDownloads.map(pdf => ({
          id: pdf.id,
          email: pdf.email,
          createdAt: pdf.createdAt,
          leadType: 'download' as const
        }));

        // For other fields, simply append PDF downloads after leads
        const combinedResults = [
          ...transformedLeads,
          ...transformedPdfDownloads
        ].slice(0, limit);

        const totalRecords = await this.getTotalCount(brandId, filterDto.q);
        const pagination = this.commonService.getPagination(
          totalRecords,
          limit,
          page,
        );

        return { data: combinedResults, pagination };
      }
    } catch (error) {
      this.logger.error('Error retrieving leads and PDF downloads', error);
      throw error;
    }
  }
  

  async deleteLead(id: number, brandId: number) {
    try {
      const response = await this.landingPageLeadsRepository.softDelete({
        id,
        brandId,
      });
      if (!response.affected) {
        throw new NotFoundException('Lead not found');
      }
      return { status: true, message: 'Lead deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting lead', error);
      throw error;
    }
  }

  private async getTotalCount(brandId: number, searchTerm?: string): Promise<number> {
    const leadsCount = this.landingPageLeadsRepository
      .createQueryBuilder('landing_page_leads')
      .where('landing_page_leads.brandId = :brandId', { brandId })
      .andWhere('landing_page_leads.deletedAt IS NULL');

    const pdfCount = this.lpPdfRepository
      .createQueryBuilder('lp_pdf')
      .where('lp_pdf.brandId = :brandId', { brandId });

    if (searchTerm) {
      const search = `%${searchTerm.toLowerCase()}%`;
      leadsCount.andWhere(
        '(LOWER(landing_page_leads.firstName) LIKE :search OR LOWER(landing_page_leads.lastName) LIKE :search OR LOWER(landing_page_leads.email) LIKE :search)',
        { search }
      );
      pdfCount.andWhere('LOWER(lp_pdf.email) LIKE :search', { search });
    }

    const [leadsTotal, pdfTotal] = await Promise.all([
      leadsCount.getCount(),
      pdfCount.getCount()
    ]);

    return leadsTotal + pdfTotal;
  }
}
