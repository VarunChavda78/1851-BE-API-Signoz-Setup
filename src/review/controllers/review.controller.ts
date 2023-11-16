import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ReviewRepository } from '../repositories/review.repository';
import { ReviewService } from '../services/review.service';
import { reviewCreateDto } from '../dtos/reviewDto';

@Controller({
  version: '1',
  path: 'review',
})
export class ReviewController {
  constructor(
    private reviewRepository: ReviewRepository,
    private reviewService: ReviewService,
  ) {}

  @Get(':id')
  async show(@Param('id') id: number) {
    const reviews = await this.reviewRepository.getBySupplierId(id);
    const data = await this.reviewService.getDetails(reviews);
    return { data: data };
  }

  @Post(':id')
  async saveReview(
    @Param('id') id: number,
    @Body() reviewRequest: reviewCreateDto,
  ) {
    await this.reviewRepository.createOrUpdateReview(id, reviewRequest);
    return {
      statusCode: HttpStatus.CREATED,
    };
  }
}
