import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RoleDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;
}

export enum RoleLists {
  SUPER_ADMIN = 1,
  ADMIN = 2,
  AUTHOR = 3,
  BRAND_USER = 4,
  SUPPLIER = 5,
}
