import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CategoryRepository } from 'src/category/repositories/category.repository';
import { ReviewRepository } from 'src/review/repositories/review.repository';

@Injectable()
export class SupplierService {
  constructor(
    private categoryRepository: CategoryRepository,
    private reviewRepository: ReviewRepository,
    private config: ConfigService,
  ) {}

  async getData(datas) {
    const details = [];
    for (const data of datas) {
      details.push(await this.getDetails(data));
    }
    return details;
  }

  async getDetails(data) {
    let category = {};
    if (data?.categoryId) {
      const categoryData = await this.categoryRepository.getById(
        data?.categoryId,
      );
      if (categoryData) {
        category = {
          id: categoryData?.id,
          name: categoryData?.name,
        };
      }
    }
    const reviews = await this.reviewRepository.find({
      where: { supplier_id: data?.id },
    });
    return {
      id: data?.id,
      name: data?.name,
      slug: data?.slug,
      logo: data?.logo
        ? `${this.config.get('s3.imageUrl')}/supplier-db/supplier/${data?.logo}`
        : `${this.config.get(
            's3.imageUrl',
          )}/supplier-db/supplier/client-logo.png`,
      location: data?.location ?? '',
      founded: data?.founded,
      rating: data?.rating ?? 0,
      review: reviews?.length ?? 0,
      description: data?.description,
      isFeatured: data?.isFeatured ? data?.isFeatured : false,
      category: category,
    };
  }
}
