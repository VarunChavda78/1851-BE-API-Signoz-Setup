import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class reviewCreateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNumber()
  role?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  other_text?: string;
}

export class ReviewFilterDto {
  @IsOptional()
  @Type(() => String)
  @IsInt()
  supplier: string;

  @IsOptional()
  @Type(() => String)
  @IsInt()
  slug: string;
}

export enum ReviewStatus {
  REQUESTED = 1,
  APPROVED = 2,
  DISAPPROVED = 3,
}
