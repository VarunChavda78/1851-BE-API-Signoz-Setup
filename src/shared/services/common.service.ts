import { Injectable } from '@nestjs/common';
import { Pagination } from '../dtos/pagination.dto';

@Injectable()
export class CommonService {
  getPagination(totalRecords: number, limit: number, page: number): Pagination {
    const totalPages = Math.ceil(totalRecords / limit);
    return {
      page,
      limit,
      totalRecords,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }
}
