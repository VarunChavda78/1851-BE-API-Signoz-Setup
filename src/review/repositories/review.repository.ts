import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Review } from '../entities/review.entity';

@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor(private dataSource: DataSource) {
    super(Review, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Review> {
    const review = await this.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException();
    }

    return review;
  }
}
