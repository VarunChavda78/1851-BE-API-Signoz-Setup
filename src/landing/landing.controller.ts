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
  Req,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { LandingService } from './landing.service';
import { UsersService } from 'src/users/users.service';
import { PageOptionsDto } from './dtos/pageOptionsDto';
import { LpPageRepository } from './lp-page.repository';
import { Protected } from '../auth/auth.decorator';
import { AuthService } from 'src/auth/auth.service';
import { CreateLeadDto } from './dtos/createLeadDto';

@Controller({
  version: '1',
  path: 'landing',
})
export class LandingController {
  constructor(
    private readonly landingService: LandingService,
    private readonly usersService: UsersService,
    private readonly lpPageRepository: LpPageRepository,
    private readonly authService: AuthService
    
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

  @Protected()
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
    @Req() req
  ) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      if (!this.authService.validateUser(brand.id, req.user)) {
        throw new BadRequestException(`Unauthorized to access resources for ${slug}`);
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

  @Protected()
  @Post(':slug/create')
  @HttpCode(HttpStatus.CREATED) // Sets the response code to 201
  async createPage(
    @Param('slug') slug: string,
    @Body() createPageDto: { name: string; templateId: number },
    @Req() req
  ) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      if (!this.authService.validateUser(brand.id, req.user)) {
        throw new BadRequestException(`Unauthorized to access resources for ${slug}`);
      }
      const newPage = await this.landingService.createPage(slug, createPageDto, brand.id, req.user.id);
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

  @Get(':slug/status')
  @HttpCode(HttpStatus.OK)
  async getLandingPageStatus(@Param('slug') slug: string) {
    try {
      const data = await this.landingService.getLandingPageStatus(slug);
      return {
        status: true,
        data,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  @Protected()
  @Post(':slug/status')
  @HttpCode(HttpStatus.OK)
  async updateLandingPageStatus(
    @Param('slug') slug: string,
    @Body() body: { status: boolean },
    @Req() req
  ) {
    try {
      const userId = req.user.id; // Replace this with actual user ID from auth context
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      if (!this.authService.validateUser(brand.id, req.user)) {
        throw new BadRequestException(`Unauthorized to access resources for ${slug}`);
      }
      const data = await this.landingService.updateLandingPageStatus(slug, body.status, userId);
      return {
        status: true,
        data,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  @Protected()
  @Delete(':slug/:lpId')
  @HttpCode(HttpStatus.OK)
  async deletePage(@Param('slug') slug: string, @Param('lpId') lpId: number, @Req() req) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      if (!this.authService.validateUser(brand.id, req.user)) {
        throw new BadRequestException(`Unauthorized to access resources for ${slug}`);
      }
      await this.landingService.deletePage(brand.id, lpId);
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

  @Protected()
  @Post(':slug/:lpId/:sectionSlug')
  async createOrUpdateSection(
    @Param('slug') slug: string,
    @Param('lpId') lpId: number,
    @Param('sectionSlug') sectionSlug: string,
    @Body() createLandingPageDto: any,
    @Req() req
  ) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      if (!this.authService.validateUser(brand.id, req.user)) {
        throw new BadRequestException(
          `Unauthorized to access resources for ${slug}`,
        );
      }
      const data = await this.landingService.createOrUpdateSection(
        brand.id,
        lpId,
        sectionSlug,
        createLandingPageDto,
        req.user.id,
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
  @Post('pdf')
  async createPdf(
    @Query('slug') slug: string,
    @Body()
    pdfDto: {
      email: string;
    },
  ) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);

      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }

      const pdf = await this.landingService.createPdf(slug, brand.id, pdfDto);

      return {
        status: true,
        pdf: pdf,
        message: 'Pdf has been added successfully',
      };
    } catch (err) {
      return {
        status: false,
        message: err?.message,
      };
    }
  }

  @Post('lp-leads')
  async createLpLeads(@Query('slug') slug: string, @Body() lpLeadsDto: CreateLeadDto){
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      const result = await this.landingService.createLpLead(brand.id, slug, lpLeadsDto);
      return result
    } catch (error) {
      throw new HttpException('Failed to create leads', error?.status || 500);
    }
  }

  @Delete('lp-leads/:slug/:uid')
  async deleteLpLead(@Param('slug') slug: string, @Param('uid') uid: string) {
    try {
      const brand = await this.usersService.getBrandIdBySlug(slug);
      if (!brand) {
        throw new Error(`Brand not found for slug: ${slug}`);
      }
      const result = await this.landingService.deleteLpLead(brand.id, uid);
      return result
    } catch (error) {
      console.log('error', error);
      throw new HttpException(error?.message || 'Failed to delete leads', error?.status || 500);
    }
  }
}
