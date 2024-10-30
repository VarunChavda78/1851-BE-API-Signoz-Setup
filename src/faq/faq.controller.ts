import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dtos/create-faq.dto';
import { UpdateFaqDto } from './dtos/update-faq.dto';

@Controller({
  version: '1',
  path: 'faq',
})
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get(':brandId')
  async findAll(@Param('brandId') brandId: number) {
    try {
      const faqs = await this.faqService.findAll(brandId);
      return { data: faqs };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve FAQs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':brandId')
  async create(
    @Param('brandId') brandId: number,
    @Body() createFaqDto: CreateFaqDto,
  ) {
    try {
      const newFaq = await this.faqService.create(brandId, createFaqDto);
      return { message: 'FAQ added successfully.', data: newFaq };
    } catch (error) {
      throw new HttpException(
        'Failed to create FAQ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':brandId/update/:faqId')
  async update(
    @Param('brandId') brandId: number,
    @Param('faqId') faqId: number,
    @Body() updateFaqDto: UpdateFaqDto,
  ) {
    try {
      const updatedFaq = await this.faqService.update(
        brandId,
        faqId,
        updateFaqDto,
      );
      return {
        status: true,
        message: 'FAQ updated successfully.',
        data: updatedFaq,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to update FAQ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':brandId/remove/:faqId')
  async delete(
    @Param('brandId') brandId: number,
    @Param('faqId') faqId: number,
  ) {
    try {
      await this.faqService.delete(brandId, faqId);
      return { message: 'FAQ deleted successfully.' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete FAQ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
