import { Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { ReviewRepository } from '../repositories/review.repository';
import { PageMetaDto } from 'src/shared/dtos/pageMetaDto';
import { PageDto } from 'src/shared/dtos/pageDto';
import { ReviewFilterDto } from '../dtos/reviewDto';

@Injectable()
export class ReviewService {
  constructor(
    private supplierRepositroy: SupplierRepository,
    private repository: ReviewRepository,
  ) {}

  async getReviewListBySupplierId(id: number, pageOptionsDto: PageOptionsDto) {
    const { skip, limit, order, sort }: any = pageOptionsDto;
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
    const { skip, limit, order, sort } = pageOptionsDto;
    const orderBy: any = order?.toUpperCase() ?? 'ASC';
    const { supplier } = filterDto;
    const queryBuilder = this.repository.createQueryBuilder('review');

    if (supplier) {
      const supplierId = await this.repository.transformStringToArray(supplier);
      queryBuilder.andWhere('review.supplier_id IN (:...supplierId)', {
        supplierId,
      });
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
              logo: supplierData?.logo,
              founded: supplierData?.founded,
              isFeatured: supplierData?.isFeatured,
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
          rating: review.rating,
          supplier,
        });
      }
    }
    return data;
  }
}
