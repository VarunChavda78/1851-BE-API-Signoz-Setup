import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BrandDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  logo: string;

  @ApiProperty({ required: true })
  @IsString()
  url: string;
}
