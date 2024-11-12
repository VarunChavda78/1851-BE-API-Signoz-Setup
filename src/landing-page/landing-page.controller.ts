import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { LandingPageService } from './landing-page.service';
// import { CreateLandingPageDto } from './dto/create-landing-page.dto';

@Controller({
  version: '1',
  path: 'landing-page',
})
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

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
}
