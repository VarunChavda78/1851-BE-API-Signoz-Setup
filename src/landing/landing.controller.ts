import {
  Controller,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { LandingService } from './landing.service';

@Controller({
  version: '1',
  path: 'landing',
})
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @Get(':slug/pages')
  @HttpCode(HttpStatus.OK) // Sets the response code to 200
  async getPages(@Param('slug') slug: string) {
    try {
      const pages = await this.landingService.getPagesBySlug(slug);
      return {
        status: true,
        data: pages,
      };
    } catch (error) {
      return {
        status: false,
        data: error.message,
      };
    }
  }

  // @Post(':slug/create')
  // @HttpCode(HttpStatus.CREATED) // Sets the response code to 201
  // async createPage(
  //   @Param('slug') slug: string,
  //   @Body() createPageDto: { name: string; templateId: number },
  // ) {
  //   try {
  //     const newPage = await this.landingService.createPage(slug, createPageDto);
  //     return {
  //       status: true,
  //       data: newPage,
  //     };
  //   } catch (error) {
  //     return {
  //       status: false,
  //       data: error.message,
  //     };
  //   }
  // }
}
