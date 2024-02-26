import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SlugHistoryDto {
  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}

export enum SlugObjectType {
  OBJECT_TYPE_ARTICLE = 1,
  OBJECT_TYPE_BRAND = 2,
  OBJECT_TYPE_AUTHOR = 3,
  OBJECT_TYPE_SUPPLIER = 4,
  OBJECT_TYPE_CATEGORY = 5,
}

export enum SlugUserType {
  USER_TYPE_ADMIN = 1,
  USER_TYPE_USER = 2,
}

