import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LatestNewsDto {
  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}
