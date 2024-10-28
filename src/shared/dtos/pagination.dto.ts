
export interface PaginationDto {
    limit: number;
    page: number;
    order : string;
    sort : string;
}

export interface Pagination {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }