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
import { PageOptionsDto } from './dtos/pageOptionsDto';

@Controller({
  version: '1',
  path: 'landing',
})
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

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
}
