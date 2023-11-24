import { Injectable } from '@nestjs/common';

@Injectable()
export class SupplierInfoService {
  constructor() {}

  async getDetails(data) {
    let result = {};
    if (data) {
      result = {
        id: data?.supplier_id,
      };
    }
    return result;
  }
}
