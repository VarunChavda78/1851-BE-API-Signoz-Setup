import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
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
  category_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  is_featured: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  founded: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  video_url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  created_by: number;
}

export class FilterDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsString()
  featured: boolean = false;

  @IsOptional()
  @Type(() => String)
  @IsString()
  category: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  rating: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  slug: string;
}
