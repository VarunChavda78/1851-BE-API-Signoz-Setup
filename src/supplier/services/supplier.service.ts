import { Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/category/repositories/category.repository';
import { FilterDto } from '../dtos/supplierDto';
import { PageMetaDto } from 'src/shared/dtos/pageMetaDto';
import { PageDto } from 'src/shared/dtos/pageDto';
import { SupplierRepository } from '../repositories/supplier.repository';
import { ConfigService } from '@nestjs/config';
import { PageOptionsDto } from '../dtos/pageOptionsDto';
import { UserStatus } from 'src/user/dtos/UserDto';
import * as dayjs from 'dayjs';
import { PowerRankingObjectTypes } from 'src/power-ranking/dtos/PowerRankingDto';

@Injectable()
export class SupplierService {
  constructor(
    private categoryRepository: CategoryRepository,
    private repository: SupplierRepository,
    private config: ConfigService,
  ) {}

  async getLists(filterData: FilterDto, pageOptions: PageOptionsDto) {
    const {
      page = 1,
      limit = 10,
      order = 'DESC',
      sort = 'rating',
    }: any = pageOptions;
    const skip = (page - 1) * limit;
    const { featured, category, rating, slug, state } = filterData;
    const fieldsArray = sort.split(',');
    const ordersArray = order.split(',');
    const today = dayjs().format('YYYY-MM-DD');
    const queryBuilder = await this.repository
      .createQueryBuilder('suppliers')
      .leftJoinAndSelect('suppliers.user', 'user')
      .leftJoinAndSelect('suppliers.supplierInfo', 'supplierInfo')
      .where('user.status = :status', {
        status: UserStatus.APPROVED,
      });

    if (fieldsArray.includes('rank')) {
      queryBuilder
        .leftJoinAndSelect('suppliers.powerRanking', 'powerRanking')
        .where('DATE(powerRanking.created_at) = :today', { today })
        .andWhere('powerRanking.object_type = :type', {
          type: PowerRankingObjectTypes.TYPE_SUPPLIER,
        });
    }
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

    if (state) {
      const stateList = state.split(',');
      queryBuilder.andWhere('suppliers.state IN (:...stateList)', {
        stateList,
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

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    fieldsArray.forEach((field, index) => {
      const table = fieldsArray.includes('rank') ? 'powerRanking' : 'suppliers';
      orderBy[`${table}.${field}`] = ordersArray[index] || 'ASC';
    });
    const itemCount = await queryBuilder.getCount();
    const suppliers = await queryBuilder
      .orderBy(orderBy)
      .skip(skip)
      .take(limit)
      .getMany();
    const details = [];
    if (suppliers.length) {
      for (const data of suppliers) {
        details.push(await this.getDetails(data));
      }
    }
    const pageOptionsDto = {
      page,
      limit,
    };
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(details, pageMetaDto);
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
    return {
      id: data?.id,
      name: data?.name,
      slug: data?.slug,
      logo: data?.logo
        ? `${this.config.get(
            's3.imageUrl',
          )}/supplier-db/supplier/${data?.id}/${data?.logo}`
        : `${this.config.get(
            's3.imageUrl',
          )}/supplier-db/supplier/client-logo.png`,
      location:
        data?.city && data?.state
          ? `${data?.city}, ${data?.state}`
          : data?.city && !data?.state
            ? `${data.state}`
            : !data?.city && data?.state
              ? `${data.city}`
              : '',
      founded: data?.founded,
      rating: Number(data?.rating)?.toFixed(1) ?? 0,
      review: data?.review ?? 0,
      description: data?.supplierInfo?.ats_content,
      isFeatured: data?.is_featured ? data?.is_featured : false,
      video: data?.mts_video ?? '',
      category: category,
      rank: data?.powerRanking ? data?.powerRanking[0]?.rank : null,
    };
  }
}
