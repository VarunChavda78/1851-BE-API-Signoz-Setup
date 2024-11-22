import { IsEnum, IsOptional, IsISO8601 } from 'class-validator';

export class GetSiteLogDto {
  @IsEnum(['user', 'author', 'admin', 'user_author'], {
    message: 'Type must be user, author, admin or user_author'
  })
  type: string;

  @IsOptional()
  @IsISO8601({}, { 
    message: 'Date must be in YYYY-MM-DD format' 
  })
  loginDate?: string;

  @IsOptional()
  search?: string;
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