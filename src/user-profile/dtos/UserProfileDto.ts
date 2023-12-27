import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserProfileDto {
  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}
