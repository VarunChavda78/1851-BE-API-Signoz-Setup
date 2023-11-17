import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Review } from '../entities/review.entity';
import { PaginationDto, ReviewFilterDto } from '../dtos/reviewDto';

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

  async findAll(filterDto: ReviewFilterDto): Promise<Review[]> {
    let { page, limit } = filterDto;
    page = page ?? 1;
    limit = limit ?? 10;
    const { supplier } = filterDto;
    const skip = (page - 1) * limit;
    const queryBuilder = this.createQueryBuilder('review');

    if (supplier) {
      const supplierId = await this.transformStringToArray(supplier);
      queryBuilder.andWhere('review.supplier_id IN (:...supplierId)', {
        supplierId,
      });
    }
    const review = await queryBuilder.skip(skip).take(limit).getMany();
    if (!review.length) {
      throw new NotFoundException();
    }
    return review;
  }

  async getBySupplierId(
    id: number,
    pagination: PaginationDto,
  ): Promise<Review[]> {
    let { page, limit }: any = pagination;
    page = page ?? 1;
    limit = limit ?? 10;
    const skip = (page - 1) * limit;
    const review = await this.find({
      skip,
      take: limit,
      where: { supplier_id: id },
    });
    if (!review.length) {
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

    return result;
  }

  transformStringToArray(inputString: string): number[] {
    const stringArray = inputString.split(','); // Split the string into an array using ',' as the delimiter
    const numberArray = stringArray.map(Number); // Convert each element to a number

    return numberArray;
  }
}
