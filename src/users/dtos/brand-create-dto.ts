import { IsEmail, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class BrandCreateDto {
  @IsString()
  company: string;

  @IsString()
  brand_url: string;

  @IsString()
  user_name: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  franchise_link: string;

  @IsString()
  analytics_domain?: string;

  @IsString()
  facebook_page: string;

  @IsEmail()
  franchise_connection_email?: string;

  @IsEmail()
  story_approve_email?: string;

  @IsString()
  story_approve_text?: string;

  @IsNumber()
  brand_category_id?: number;

  @IsString()
  photo?: string;
}
