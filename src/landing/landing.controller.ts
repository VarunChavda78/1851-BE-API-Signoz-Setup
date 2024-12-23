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

@Controller({
  version: '1',
  path: 'landing',
})
export class LandingController {
  constructor(
    private readonly landingService: LandingService,
    private readonly usersService: UsersService,
  ) {}

  @Get(':slug/pages')
  @HttpCode(HttpStatus.OK) // Sets the response code to 200
  async getPages(
    @Param('slug') slug: string,
    @Query('sort') sort?: string,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('limit') limit: number = 20,
    @Query('page') page: number = 1,
  ) {
    try {
      const pages = await this.landingService.getPagesBySlug(slug, {
        sort,
        order,
        limit,
        page,
      });
      return {
        status: true,
        data: pages.data,
        pagination: {
          limit,
          page,
          totalRecords: pages.totalRecords,
        },
      };
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
