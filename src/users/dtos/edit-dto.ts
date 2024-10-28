import { IsArray, IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  pageUrl: string;

  @IsString()
  authorTitle?: string;

  @IsString()
  authorFrom?: string;

  @IsArray()
  brands?: number[];

  @IsString()
  gtmId?: string;

  @IsString()
  adsAccountId?: string;

  @IsString()
  siteUrl?: string;
}
