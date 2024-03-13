
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString,IsNumber, IsOptional, ValidateNested} from 'class-validator';
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

export class PayloadDto {
  @ApiProperty({ type: [UniverstiyDto] })
  @ValidateNested({ each: true })
  @Type(() => UniverstiyDto)
  resources: UniverstiyDto[];
}

export class FilterDto {
  @Type(() => number)
  @IsNumber()
  type: number;
}



