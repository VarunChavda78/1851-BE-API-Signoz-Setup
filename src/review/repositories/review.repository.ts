import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Review } from '../entities/review.entity';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { ReviewStatus } from '../dtos/reviewDto';

@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor(
    private dataSource: DataSource,
    private supplierRepository: SupplierRepository,
  ) {
    super(Review, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Review> {
    const review = await this.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException();
    }
    return review;
  }

  async createReview(id: number, reviewRequest: any) {
    const review = {
      name: reviewRequest?.name,
      supplier_id: id,
      comment: reviewRequest?.comment,
      rating: reviewRequest?.rating ?? 0,
      title: reviewRequest?.title,
      company: reviewRequest?.company,
      status: ReviewStatus.APPROVED,
    };

    const result = await this.save(review);
    const reviewResults = await this.find({
      where: { supplier_id: id, status: ReviewStatus.APPROVED },
    });
    const total = reviewResults?.length;
    let count = 0;
    reviewResults.forEach(function (reviewResult) {
      count += reviewResult?.rating;
    });
    const rating = count / total;
    const score = total + count;
    await this.supplierRepository.update(
      { id },
      { rating, review: total, score },
    );

    return result;
  }

  transformStringToArray(inputString: string): number[] {
    const stringArray = inputString.split(','); // Split the string into an array using ',' as the delimiter
    const numberArray = stringArray.map(Number); // Convert each element to a number

    return numberArray;
  }
}
