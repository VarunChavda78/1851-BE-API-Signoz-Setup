
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString,IsNumber, IsOptional} from 'class-validator';
import { number } from 'joi';

export class UniverstiyDto {
  @ApiProperty({ required: true })
  @IsString()
  heading: string;

  @ApiProperty({ required: true })
  @IsString()
  url: string;

  @ApiProperty({ required: true })
  @IsString()
  image: string;

  @ApiProperty({ required: true })
  @IsString()
  pdf: string;

  @ApiProperty({ required: true })
  @IsNumber()
  type: number;

  @ApiProperty({ required: false })
  @IsNumber()
  created_by: number;

  @ApiProperty({ required: false })
  @IsNumber()
  updated_by: number;
}

export class FilterDto {
  @IsOptional()
  @Type(() => number)
  @IsNumber()
  type: number;

  @IsOptional()
  @Type(() => String)
  @IsString()
  search_input: string;

}



