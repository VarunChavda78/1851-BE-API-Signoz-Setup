export class GetNavigationMenuDto {
    search?: string;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
  }