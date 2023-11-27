import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Review } from '../entities/review.entity';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';

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

  async createReview(id: number, reviewRequest: any): Promise<Review> {
    const review = new Review();
    review.name = reviewRequest?.name;
    review.supplier_id = id;
    review.comment = reviewRequest?.comment;
    review.rating = reviewRequest?.rating ?? 0;
    review.title = reviewRequest?.title;
    review.company = reviewRequest?.company;

    const result = await this.save(review);
    const reviewResults = await this.find({ where: { supplier_id: id } });
    const total = reviewResults?.length;
    let count = 0;
    reviewResults.forEach(function (reviewResult) {
      count += reviewResult?.rating;
    });
    const rating = count / total;
    await this.supplierRepository.update({ id }, { rating, review: total });

    return result;
  }

  transformStringToArray(inputString: string): number[] {
    const stringArray = inputString.split(','); // Split the string into an array using ',' as the delimiter
    const numberArray = stringArray.map(Number); // Convert each element to a number

    return numberArray;
  }
}
