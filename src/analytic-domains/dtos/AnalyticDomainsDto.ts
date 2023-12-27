import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AnalyticDomainsDto {
  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}
