import { IsArray, IsEmail, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class BrandCreateDto {
  @IsString()
  company: string;

  @IsString()
  brand_url: string;

  @IsString()
  user_name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  franchise_link?: string;

  @IsArray()
  @IsString({ each: true })
  analytics_domain?: string[];

  @IsString()
  facebook_page?: string;

  @IsEmail()
  franchise_connection_email?: string;

  @IsEmail()
  story_approval_email?: string;

  @IsString()
  story_approve_text?: string;

  @IsNumber()
  brand_category_id?: number;

  @IsString()
  photo?: string;

  @IsString()
  type: string;

  @IsString()
  newsletter_list_id?: string;
}

export class BrandUpdateDto extends BrandCreateDto {}