import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from 'src/category/repositories/category.repository';
import { ReviewRepository } from 'src/review/repositories/review.repository';
import { FilterDto } from '../dtos/supplierDto';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';
import { PageMetaDto } from 'src/shared/dtos/pageMetaDto';
import { PageDto } from 'src/shared/dtos/pageDto';
import { SupplierRepository } from '../repositories/supplier.repository';

@Injectable()
export class SupplierService {
  constructor(
    private categoryRepository: CategoryRepository,
    private reviewRepository: ReviewRepository,
    private repository: SupplierRepository,
  ) {}

  async getSupplierLists(
    filterData: FilterDto,
    pageOptionsDto: PageOptionsDto,
  ) {
    const { skip, limit } = pageOptionsDto;
    const { featured, category, rating } = filterData;
    const queryBuilder = this.repository.createQueryBuilder('suppliers');
    if (featured) {
      const isFeatured = Boolean(featured);
      queryBuilder.andWhere('suppliers.isFeatured = :isFeatured', {
        isFeatured,
      });
    }
    if (category) {
      const categoryId = await this.repository.transformStringToArray(category);
      queryBuilder.andWhere('suppliers.categoryId IN (:...categoryId)', {
        categoryId,
      });
    }
    if (rating) {
      const end = Number(rating);
      const start = Number(rating - 1);
      queryBuilder.andWhere('suppliers.rating BETWEEN :start AND :end', {
        start,
        end,
      });
    }
    const itemCount = await queryBuilder.getCount();
    const suppliers = await queryBuilder.skip(skip).take(limit).getMany();
    if (!suppliers.length) {
      throw new NotFoundException();
    }

    const data = await this.getData(suppliers);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(data, pageMetaDto);
  }

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
      logo: data?.logo,
      location: data?.location,
      founded: data?.founded,
      rating: data?.rating,
      review: reviews?.length ?? 0,
      description: data?.description,
      isFeatured: data?.isFeatured ? data?.isFeatured : false,
      category: category,
    };
  }
}
