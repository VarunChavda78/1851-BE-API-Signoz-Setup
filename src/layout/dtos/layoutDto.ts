import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class LayoutDto {
  @IsOptional()
  @Type(() => String)
  @IsString()
  slug: string;
}
