import { Injectable } from '@nestjs/common';

@Injectable()
export class SupplierService {
  constructor() {}

  async getData(datas) {
    const details = [];
    for (const data of datas) {
      details.push(await this.getDetails(data));
    }
    return details;
  }

  async getDetails(data) {
    return {
      id: data?.id,
      name: data?.name,
      slug: data?.slug,
      logo: data?.logo,
      location: data?.location,
      founded: data?.foundedDate,
      description: data?.description,
      isFeatured: data?.isFeatured ? data?.isFeatured : false,
      category: data?.categoryId ?? null,
    };
  }
}
