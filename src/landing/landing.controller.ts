import {
  Controller,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { LandingService } from './landing.service';
import { UsersService } from 'src/users/users.service';
import { PageOptionsDto } from './dtos/pageOptionsDto';
import { LpPageRepository } from './lp-page.repository';

@Controller({
  version: '1',
  path: 'landing',
})
export class LandingController {
  constructor(
    private readonly landingService: LandingService,
    private readonly usersService: UsersService,
    private readonly lpPageRepository: LpPageRepository,
  ) {}

  @Get('mapped-domain')
  async getMappedDomains() {
    try {
      const mappedDomains = await this.lpPageRepository.find({
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
      return { status: false, error };
    }
  }

  @Post('publish/:slug/:lpId')
  async createOrUpdatePublish(
    @Param('slug') slug: string,
    @Param('lpId') lpId: number,
    @Body()
    publishDto: {
      publishStatus: boolean;
      domainType: string;
      domain?: string;
      customDomainStatus?: string;
    },
  ) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      const data = await this.landingService.UpdatePublishData(
        lpId,
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

  @Get('publish/:slug/:lpId')
  async getPublishData(
    @Param('slug') slug: string,
    @Param('lpId') lpId: number,
  ) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      const publishData = await this.landingService.getPublishData(lpId);
      return {
        status: true,
        data: publishData,
      };
    } catch (err) {
      return { status: false, message: err?.message };
    }
  }

  @Get('publish-status/:slug')
  async publishStatus(@Param('slug') slug: string) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      const publishData = await this.landingService.publishStatus(slug);
      return {
        status: true,
        data: publishData,
      };
    } catch (err) {
      return { status: false, message: err?.message };
    }
  }

  @Get(':slug/pages')
  @HttpCode(HttpStatus.OK) // Sets the response code to 200
  async getPages(
    @Param('slug') slug: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    try {
      return await this.landingService.getPagesBySlug(slug, pageOptionsDto);
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  @Post(':slug/create')
  @HttpCode(HttpStatus.CREATED) // Sets the response code to 201
  async createPage(
    @Param('slug') slug: string,
    @Body() createPageDto: { name: string; templateId: number },
  ) {
    try {
      const newPage = await this.landingService.createPage(slug, createPageDto);
      return {
        status: true,
        data: newPage,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  @Delete(':slug/:lpId')
  @HttpCode(HttpStatus.OK)
  async deletePage(@Param('slug') slug: string, @Param('lpId') lpId: number) {
    try {
      await this.landingService.deletePage(slug, lpId);
      return {
        status: true,
        message: 'Page deleted successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  @Post(':slug/:lpId/:sectionSlug')
  async createOrUpdateSection(
    @Param('slug') slug: string,
    @Param('lpId') lpId: number,
    @Param('sectionSlug') sectionSlug: string,
    @Body() createLandingPageDto: any,
  ) {
    try {
      const data = await this.landingService.createOrUpdateSection(
        slug,
        lpId,
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

  @Get(':slug/:lpId/:sectionSlug')
  async findSection(
    @Param('slug') slug: string,
    @Param('lpId') lpId: number,
    @Param('sectionSlug') sectionSlug: string,
  ) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      const page = await this.landingService.findSection(lpId, sectionSlug);
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
}
