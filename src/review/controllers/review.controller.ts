import { Controller, Post } from '@nestjs/common';

@Controller('review')
export class ReviewController {
  constructor() {}

  @Post('review:id')
  async saveReview() {
    return {};
  }
}
