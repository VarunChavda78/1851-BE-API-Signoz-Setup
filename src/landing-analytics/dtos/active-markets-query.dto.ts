import {
  IsOptional,
  IsString,
  IsDateString,
  IsIn,
  IsInt,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ActiveMarketsQueryDto {
  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  @IsIn(['rank', 'users', 'averageReads', 'duration'])
  sort: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  limit: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page: number;
}
