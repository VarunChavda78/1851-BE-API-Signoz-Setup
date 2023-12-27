import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}

export enum UserStatus {
  DRAFT = 1,
  APPROVED = 2,
  DISAPPROVE = 3,
}
