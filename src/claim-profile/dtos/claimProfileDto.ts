import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClaimProfileDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  phone: string;
}
