import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Logger,
  Query,
} from '@nestjs/common';
import { LandingPageService } from './landing-page.service';
import { UsersService } from 'src/users/users.service';
import { LandingPagePublishRepository } from './landing-page-publish.repository';
import { LeadsFilterDto } from './dto/leads-dto';

@Controller({
  version: '1',
  path: 'landing-page',
})
export class LandingPageController {
  private logger = new Logger('LandingPageController');

  constructor(
    private readonly landingPageService: LandingPageService,
    private readonly landingPagePublishRepository: LandingPagePublishRepository,
    private readonly usersService: UsersService,
  ) {}

  @Get('mapped-domain')
  async getMappedDomains() {
    try {
      const mappedDomains = await this.landingPagePublishRepository.find({
        where: { domainType: 2 },
      });

      const result: { [domain: string]: string } = {};
      mappedDomains.forEach((item) => {
        if (item.domain && item.brandSlug) {
          result[item.domain] = item.brandSlug;
        }
      });

      return { status: true, data: result };
    } catch (error) {
      this.logger.error('Error retrieving mapped domains', error);
      return { status: false, error };
    }
  }
  @Post('leads')
  async createLead(
    @Query('slug') slug: string,
    @Body()
    leadDataDto: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      city?: string;
      state?: string;
      zip?: string;
      interest?: string;
    },
  ) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);

      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }

      const lead = await this.landingPageService.createLead(
        brand.id,
        leadDataDto,
      );

      return {
        status: true,
        id: lead.id,
        message: 'Lead has been added successfully',
      };
    } catch (err) {
      return {
        status: false,
        message: err?.message,
      };
    }
  }
  @Get('leads')
  async getLeads(@Query('slug') slug: string, @Query() filterDto: LeadsFilterDto) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      const leads = await this.landingPageService.getLeads(brand.id, filterDto);
      return {
        status: true,
        leads,
      };
    } catch (err) {
      return { status: false, message: err?.message, leads: [] };
    }
  }
  @Get(':brandId')
  async getSection(@Param('brandId') brandId: number) {
    try {
      const page = await this.landingPageService.findOne(brandId);
      if (!page) {
        throw new Error(`Content not found for this brand id ${brandId}.`);
      }
      return {
        status: true,
        content: page?.content || '',
      };
    } catch (err) {
      return { status: false, message: err?.message, content: '' };
    }
  }

  @Post(':brandId')
  async createOrUpdate(
    @Param('brandId') brandId: number,
    @Body() createLandingPageDto: any,
  ) {
    try {
      const data = await this.landingPageService.createOrUpdate(
        brandId,
        createLandingPageDto,
      );
      return {
        status: true,
        message: data?.message,
        content: data?.page?.content,
      };
    } catch (err) {
      return { status: false, message: err?.message };
    }
  }

  @Post('publish/:slug')
  async createOrUpdatePublish(
    @Param('slug') slug: string,
    @Body()
    publishDto: { publishStatus: boolean; domainType: string; domain?: string; customDomainStatus?: string; },
  ) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      const data = await this.landingPageService.createOrUpdatePublish(
        brand?.id,
        publishDto,
        slug,
      );
      return {
        status: true,
        message: 'Publish data saved successfully',
        data,
      };
    } catch (err) {
      return { status: false, message: err?.message };
    }
  }

  @Get('publish/:slug')
  async getPublishData(@Param('slug') slug: string) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      const publishData = await this.landingPageService.getPublishData(
        brand?.id,
      );
      return {
        status: true,
        data: publishData,
      };
    } catch (err) {
      return { status: false, message: err?.message };
    }
  }

  @Get(':slug/:sectionSlug')
  async findSection(
    @Param('slug') slug: string,
    @Param('sectionSlug') sectionSlug: string,
  ) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      const page = await this.landingPageService.findSection(
        brand?.id,
        sectionSlug,
      );
      if (!page) {
        throw new Error(
          `Content not found for slug ${slug} and section slug ${sectionSlug}.`,
        );
      }
      return {
        status: true,
        content: page?.content || '',
      };
    } catch (err) {
      return { status: false, message: err?.message, content: '' };
    }
  }

  @Post(':slug/:sectionSlug')
  async createOrUpdateSection(
    @Param('slug') slug: string,
    @Param('sectionSlug') sectionSlug: string,
    @Body() createLandingPageDto: any,
  ) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      const data = await this.landingPageService.createOrUpdateSection(
        brand?.id,
        sectionSlug,
        createLandingPageDto,
      );
      return {
        status: true,
        message: data?.message,
        content: data?.page?.content,
      };
    } catch (err) {
      return { status: false, message: err?.message };
    }
  }
}
