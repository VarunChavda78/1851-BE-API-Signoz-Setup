
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber} from 'class-validator';

export class UniverstiyDto {
  @ApiProperty({ required: true })
  @IsString()
  heading: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pdf: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  type: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  created_by: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  updated_by: number;
}

export enum UniversityType {
  TYPE_BUY_A_FRANCHISE = 1,
  TYPE_GROW_A_FRANCHISE = 2,
  TYPE_FRANCHISE_RESOURCE = 3,
}


