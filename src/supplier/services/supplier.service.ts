import { Injectable } from '@nestjs/common';

@Injectable()
export class SupplierService {
  constructor() {}

  async getDetails(datas) {
    const details = [];
    for (const data of datas) {
      details.push({
        id: data?.id,
        name: data?.name,
        slug: data?.slug,
        logo: data?.logo,
        location: data?.location,
        founded: data?.foundedDate,
        description: data?.description,
        isFeatured: data?.isFeatured ? data?.isFeatured : false,
        category: data?.categoryId,
      });
    }
    return details;
  }
}
