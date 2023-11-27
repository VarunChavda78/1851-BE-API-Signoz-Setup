import { ApiProperty } from '@nestjs/swagger';
import { Media } from 'aws-sdk/clients/transcribeservice';
import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class supplierInfoDto {
  @ApiProperty({ required: true })
  @IsString()
  highlight_title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  mts_media: Media;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mts_content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  difference_media: Media;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  difference_content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  services: string;
}

export class MediaInfo {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url: string;
}

export class InfoFilter {
  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}
