import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewService } from './services/review.service';
import { ReviewFilterDto, reviewCreateDto } from './dtos/reviewDto';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';

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
  async list(
    @Query() filterDto: ReviewFilterDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.reviewService.getList(filterDto, pageOptionsDto);
  }

  @Get(':supplierId')
  async show(
    @Param('supplierId') supplierId: number,
    @Query() pagination: PageOptionsDto,
  ) {
    return await this.reviewService.getReviewListBySupplierId(
      supplierId,
      pagination,
    );
  }

  @Post(':supplierId')
  async saveReview(
    @Param('supplierId') supplierId: number,
    @Body() reviewRequest: reviewCreateDto,
  ) {
    await this.reviewRepository.createReview(supplierId, reviewRequest);
    return {
      statusCode: HttpStatus.CREATED,
      status: 'Your review created successfully.',
    };
  }
}
