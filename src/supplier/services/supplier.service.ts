import { Injectable } from '@nestjs/common';
import { SupplierRepository } from '../repositories/supplier.repository';

@Injectable()
export class SupplierService {
  constructor(private repository: SupplierRepository) {}

  async getDetails(datas) {
    const details = [];
    for (const data of datas) {
      details.push({
        id: data.id,
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        location: data.location,
        founded: data.foundedDate,
        description: data.description,
        isFeatured: data.isFeatured,
      });
    }
    return details;
  }
}
