import { Injectable } from '@nestjs/common';
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
    const { page, limit, order, sort } = pageOptionsDto;
    const skip = (page - 1) * limit;
    const { featured, category, rating, slug } = filterData;
    const orderBy: any = order?.toUpperCase() ?? 'ASC';
    const queryBuilder = this.repository.createQueryBuilder('suppliers');
    if (slug) {
      queryBuilder.andWhere('suppliers.slug = :slug', {
        slug,
      });
    }
    if (featured) {
      const isFeatured = Boolean(featured);
      queryBuilder.andWhere('suppliers.is_featured = :isFeatured', {
        isFeatured,
      });
    }
    if (category) {
      const categoryId = await this.repository.transformStringToArray(category);
      queryBuilder.andWhere('suppliers.category_id IN (:...categoryId)', {
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
      .orderBy(sort, orderBy)
      .skip(skip)
      .take(limit)
      .getMany();

    const data = await this.getData(suppliers);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(data, pageMetaDto);
  }

  async getData(datas) {
    const details = [];
    if (datas.length) {
      for (const data of datas) {
        details.push(await this.getDetails(data));
      }
    }
    return details;
  }

  async getDetails(data) {
    let category = {};
    if (data?.category_id) {
      const categoryData = await this.categoryRepository.findOne({
        where: { id: data?.category_id },
      });
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
      rating: Number(data?.rating)?.toFixed(1) ?? 0,
      review: reviews?.length ?? 0,
      description: data?.description,
      isFeatured: data?.is_featured ? data?.is_featured : false,
      video: data?.video_url ?? '',
      category: category,
    };
  }
}
