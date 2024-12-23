import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, IsArray, IsIn } from 'class-validator';

export class PageOptionsDto {
  @IsOptional()
  @IsArray()
  sort?: string[] = ['rating'];

  @IsOptional()
  @IsArray()
  @IsIn(['ASC', 'DESC'], { each: true })
  order?: ('ASC' | 'DESC')[] = ['DESC'];

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly limit?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
