import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
}
