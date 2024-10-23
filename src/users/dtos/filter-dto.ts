import { IsNumber, IsString } from 'class-validator';

export class FilterDto {
  @IsNumber()
  page?: number;

  @IsNumber()
  limit?: number;

  @IsString()
  status?: string;

  @IsString()
  role?: string;
}
