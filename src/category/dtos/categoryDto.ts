import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class categoryDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;
}
