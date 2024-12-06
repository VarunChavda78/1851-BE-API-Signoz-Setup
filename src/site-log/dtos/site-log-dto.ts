
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsISO8601, IsNumber,IsString } from 'class-validator';
import { Pagination } from '../../shared/dtos/pagination.dto';


export class GetSiteLogDto {
  @IsEnum(['user', 'author', 'admin', 'user_author'], {
    message: 'Type must be user, author, admin or user_author'
  })
  type: string;

  @IsOptional()
  @IsISO8601({}, { 
    message: 'Date must be in YYYY-MM-DD format' 
  })
  loginDate?:string;
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @IsOptional()
  search?: string;
  
  @IsOptional()
  @IsString()
  keywordSearch?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string; 

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC'; 
}

export interface SiteLogResponse {
  image: string;
  username: string;
  type: string;
  date: string;
  loginTime: string;
  logoutTime: string;
  totalLogTime: string;
}

export interface PaginatedSiteLogResponse {
  data: SiteLogResponse[];
  pagination: Pagination;
}