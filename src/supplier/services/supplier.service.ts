import { Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/category/repositories/category.repository';

@Injectable()
export class SupplierService {
  constructor(private categoryRepository: CategoryRepository) {}

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
    return {
      id: data?.id,
      name: data?.name,
      slug: data?.slug,
      logo: data?.logo,
      location: data?.location,
      founded: data?.foundedDate,
      description: data?.description,
      isFeatured: data?.isFeatured ? data?.isFeatured : false,
      category: category,
    };
  }
}
