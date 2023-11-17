import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewRepository } from '../repositories/review.repository';
import { ReviewService } from '../services/review.service';
import { ReviewFilterDto, reviewCreateDto } from '../dtos/reviewDto';

@Controller({
  version: '1',
  path: 'review',
})
export class ReviewController {
  constructor(
    private reviewRepository: ReviewRepository,
    private reviewService: ReviewService,
  ) {}

  @Get()
  async list(@Query() filterDto: ReviewFilterDto) {
    const reviews = await this.reviewRepository.findAll(filterDto);
    const data = await this.reviewService.getDetails(reviews);
    return { data: data };
  }

  @Get(':supplierId')
  async show(@Param('supplierId') supplierId: number) {
    const reviews = await this.reviewRepository.getBySupplierId(supplierId);
    const data = await this.reviewService.getDetails(reviews);
    return { data: data };
  }

  @Post(':supplierId')
  async saveReview(
    @Param('supplierId') supplierId: number,
    @Body() reviewRequest: reviewCreateDto,
  ) {
    await this.reviewRepository.createOrUpdateReview(supplierId, reviewRequest);
    return {
      statusCode: HttpStatus.CREATED,
    };
  }
}
