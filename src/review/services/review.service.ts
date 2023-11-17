import { Injectable } from '@nestjs/common';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';

@Injectable()
export class ReviewService {
  constructor(private supplierRepositroy: SupplierRepository) {}

  async getDetails(reviews) {
    const data = [];
    for (const review of reviews) {
      let supplier = {};
      if (review?.supplier_id) {
        const supplierData = await this.supplierRepositroy.getById(
          review?.supplier_id,
        );
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
    return data;
  }
}
