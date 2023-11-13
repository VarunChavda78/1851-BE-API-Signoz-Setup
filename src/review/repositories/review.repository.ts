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

  async getBySupplierId(id: number): Promise<Review[]> {
    const review = await this.find({ where: { supplier_id: id } });
    if (!review) {
      throw new NotFoundException();
    }
    return review;
  }

  async createOrUpdateReview(id: number, reviewRequest: any): Promise<Review> {
    const review = await this.findOne({ where: { supplier_id: id } });

    const data = {
      ...reviewRequest,
      supplier_id: id,
    };

    let result: any = null;
    if (review) {
      result = await this.update(data, { supplier_id: id });
    } else {
      result = await this.create(data);
    }

    return result;
  }
}
