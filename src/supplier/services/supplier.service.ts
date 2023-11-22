import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from 'src/category/repositories/category.repository';
import { ReviewRepository } from 'src/review/repositories/review.repository';
import { FilterDto } from '../dtos/supplierDto';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';
import { PageMetaDto } from 'src/shared/dtos/pageMetaDto';
import { PageDto } from 'src/shared/dtos/pageDto';
import { SupplierRepository } from '../repositories/supplier.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupplierService {
  constructor(
    private categoryRepository: CategoryRepository,
    private reviewRepository: ReviewRepository,
    private repository: SupplierRepository,
    private config: ConfigService,
  ) {}

  async getSupplierLists(
    filterData: FilterDto,
    pageOptionsDto: PageOptionsDto,
  ) {
    const { skip, limit, order, sort } = pageOptionsDto;
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
      const ratings = await this.repository.transformStringToArray(rating);
      const minRating = Math.min(...ratings);
      const maxRating = Math.max(...ratings);
      queryBuilder
        .andWhere('suppliers.rating IN (:...ratings)', { ratings })
        .andWhere('suppliers.rating BETWEEN :minRating AND :maxRating', {
          minRating,
          maxRating,
        });
    }
    const itemCount = await queryBuilder.getCount();
    const suppliers = await queryBuilder
      .orderBy(sort, order)
      .skip(skip)
      .take(limit)
      .getMany();
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
      logo: data?.logo
        ? `${this.config.get('s3.imageUrl')}/supplier-db/supplier/${data?.logo}`
        : `${this.config.get(
            's3.imageUrl',
          )}/supplier-db/supplier/client-logo.png`,
      location: data?.location ?? '',
      founded: data?.founded,
      rating: data?.rating.toFixed(1) ?? 0,
      review: reviews?.length ?? 0,
      description: data?.description,
      isFeatured: data?.isFeatured ? data?.isFeatured : false,
      category: category,
    };
  }
}
