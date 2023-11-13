import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../repositories/review.repository';

@Injectable()
export class ReviewService {
  constructor(private repository: ReviewRepository) {}

  async getDetails(reviews) {
    const data = [];
    for (const review of reviews) {
      data.push({
        id: review.id,
        name: review.name,
        title: review.title,
        comment: review.comment,
        company: review.company,
        rating: review.rating,
      });
    }
    return data;
  }
}
