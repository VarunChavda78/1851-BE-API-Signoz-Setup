import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class supplierDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  categoryId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  founded: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  videoUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  createdBy: number;
}

export class FilterDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsInt()
  featured: boolean = false;

  @IsOptional()
  @Type(() => String)
  @IsInt()
  category: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  rating: number;
}
