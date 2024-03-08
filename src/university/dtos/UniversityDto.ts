
import { ApiProperty } from '@nestjs/swagger';
import { IsString,IsNumber} from 'class-validator';

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




