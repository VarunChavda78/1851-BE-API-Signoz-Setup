
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




