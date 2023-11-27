import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class HighlightDto {
  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}
