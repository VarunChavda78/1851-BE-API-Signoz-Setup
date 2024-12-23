import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from '../interfaces/pageMetaDtoParameters.interface';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly totalRecords: number;

  @ApiProperty()
  readonly totalPages: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.limit = pageOptionsDto.limit;
    this.totalRecords = itemCount;
    this.totalPages = Math.ceil(this.totalRecords / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.totalPages;
  }
}
