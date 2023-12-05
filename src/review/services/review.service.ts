import { Injectable, NotFoundException } from '@nestjs/common';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { ReviewRepository } from '../repositories/review.repository';
import { PageMetaDto } from 'src/shared/dtos/pageMetaDto';
import { PageDto } from 'src/shared/dtos/pageDto';
import { ReviewFilterDto } from '../dtos/reviewDto';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReviewService {
  constructor(
    private supplierRepositroy: SupplierRepository,
    private repository: ReviewRepository,
    private readonly config: ConfigService,
  ) {}

  async getReviewListBySupplierId(id: number, pageOptionsDto: PageOptionsDto) {
    const { page, limit, order, sort }: any = pageOptionsDto;
    const skip = (page - 1) * limit;
    const orderBy: any = order?.toUpperCase() ?? 'ASC';
    const queryBuilder = this.repository.createQueryBuilder('review');
    queryBuilder.andWhere('review.supplier_id = :id', {
      id,
    });
    const itemCount = await queryBuilder.getCount();
    const review = await queryBuilder
      .orderBy(sort, orderBy)
      .skip(skip)
      .take(limit)
      .getMany();
    const data = await this.getDetails(review);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(data, pageMetaDto);
  }

  async getList(filterDto: ReviewFilterDto, pageOptionsDto: PageOptionsDto) {
    const { page, limit, order, sort } = pageOptionsDto;
    const skip = (page - 1) * limit;
    const orderBy: any = order?.toUpperCase() ?? 'ASC';
    const { supplier, slug } = filterDto;
    const queryBuilder = this.repository.createQueryBuilder('review');

    if (supplier) {
      const supplierId = await this.repository.transformStringToArray(supplier);
      queryBuilder.andWhere('review.supplier_id IN (:...supplierId)', {
        supplierId,
      });
    }
    if (slug) {
      const supplier = await this.supplierRepositroy.findOne({
        where: { slug },
      });
      if (!supplier) {
        throw new NotFoundException();
      } else {
        const id = supplier?.id;
        queryBuilder.andWhere('review.supplier_id = :id', {
          id,
        });
      }
    }
    const itemCount = await queryBuilder.getCount();
    const review = await queryBuilder
      .orderBy(sort, orderBy)
      .skip(skip)
      .take(limit)
      .getMany();
    const data = await this.getDetails(review);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(data, pageMetaDto);
  }

  async getDetails(reviews) {
    const data = [];
    if (reviews?.length) {
      for (const review of reviews) {
        let supplier = {};
        if (review?.supplier_id) {
          const supplierData = await this.supplierRepositroy.findOne({
            where: { id: review?.supplier_id },
          });
          if (supplierData) {
            supplier = {
              id: supplierData?.id,
              name: supplierData?.name,
              logo: supplierData?.logo
                ? `${this.config.get(
                    's3.imageUrl',
                  )}/supplier-db/supplier/${supplierData?.logo}`
                : `${this.config.get(
                    's3.imageUrl',
                  )}/supplier-db/supplier/client-logo.png`,
              founded: supplierData?.founded,
              isFeatured: supplierData?.is_featured,
              description: supplierData?.description,
            };
          }
        }
        data.push({
          id: review.id,
          name: review.name,
          title: review.title,
          comment: review.comment,
          company: review.company,
          rating: Number(review.rating)?.toFixed(1) ?? 0,
          created_at: dayjs(review?.created_at).format('MM/DD/YYYY'),
          supplier,
        });
        data.push(supplier);
      }
    }
    return data;
  }
}
