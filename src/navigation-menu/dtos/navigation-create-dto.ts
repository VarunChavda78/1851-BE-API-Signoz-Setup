import { IsNotEmpty, IsString, IsEnum, IsOptional, IsUrl, IsNumber } from 'class-validator';

export class NavigationCreateDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  brand_pdf: string;

  @IsNotEmpty()
  @IsString()
  website: string;

  @IsOptional()
  @IsString()
  info_title: string;

  @IsNotEmpty()
  @IsString()
  section_title: string;

  @IsNotEmpty()
  @IsString()
  linkTitle1: string;

  @IsNotEmpty()
  @IsString()
  linkUrl1: string;

  @IsOptional()
  @IsNumber()
  isExternalLink1: number;

  @IsOptional()
  @IsString()
  linkImage1: string;


  @IsNotEmpty()
  @IsString()
  linkTitle2: string;

  @IsNotEmpty()
  @IsString()
  linkUrl2: string;

  @IsOptional()
  @IsNumber()
  isExternalLink2: number;

  @IsOptional()
  @IsString()
  linkImage2: string;


  @IsNotEmpty()
  @IsString()
  linkTitle3: string;

  @IsNotEmpty()
  @IsString()
  linkUrl3: string;

  @IsOptional()
  @IsNumber()
  isExternalLink3: number;

  @IsOptional()
  @IsString()
  linkImage3: string;

  @IsNotEmpty()
  @IsString()
  linkTitle4: string;

  @IsNotEmpty()
  @IsString()
  linkUrl4: string;

  @IsOptional()
  @IsNumber()
  isExternalLink4: number;

  @IsOptional()
  @IsString()
  linkImage4: string;

  @IsNotEmpty()
  @IsString()
  linkTitle5: string;

  @IsNotEmpty()
  @IsString()
  linkUrl5: string;

  @IsOptional()
  @IsNumber()
  isExternalLink5: number;

  @IsOptional()
  @IsString()
  linkImage5: string;

  @IsNotEmpty()
  @IsString()
  linkTitle6: string;

  @IsNotEmpty()
  @IsString()
  linkUrl6: string;

  @IsOptional()
  @IsNumber()
  isExternalLink6: number;

  @IsOptional()
  @IsString()
  linkImage6: string;

  @IsNotEmpty()
  @IsString()
  linkTitle7: string;

  @IsNotEmpty()
  @IsString()
  linkUrl7: string;

  @IsOptional()
  @IsNumber()
  isExternalLink7: number;

  @IsOptional()
  @IsString()
  linkImage7: string;

  @IsNotEmpty()
  @IsString()
  linkTitle8: string;

  @IsNotEmpty()
  @IsString()
  linkUrl8: string;

  @IsOptional()
  @IsNumber()
  isExternalLink8: number;

  @IsOptional()
  @IsString()
  linkImage8: string;

  @IsNotEmpty()
  @IsString()
  linkTitle9: string;

  @IsNotEmpty()
  @IsString()
  linkUrl9: string;

  @IsOptional()
  @IsNumber()
  isExternalLink9: number;

  @IsOptional()
  @IsString()
  linkImage9: string;

  @IsNotEmpty()
  @IsString()
  linkTitle10: string;

  @IsNotEmpty()
  @IsString()
  linkUrl10: string;

  @IsOptional()
  @IsNumber()
  isExternalLink10: number;

  @IsOptional()
  @IsString()
  linkImage10: string;

  @IsNotEmpty()
  @IsString()
  linkTitle11: string;

  @IsNotEmpty()
  @IsString()
  linkUrl11: string;

  @IsOptional()
  @IsNumber()
  isExternalLink11: number;

  @IsOptional()
  @IsString()
  linkImage11: string;

  @IsNotEmpty()
  @IsString()
  linkTitle12: string;

  @IsNotEmpty()
  @IsString()
  linkUrl12: string;

  @IsOptional()
  @IsNumber()
  isExternalLink12: number;

  @IsOptional()
  @IsString()
  linkImage12: string;

  @IsNotEmpty()
  @IsString()
  twitter_link: string;

  @IsNotEmpty()
  @IsString()
  facebook_link: string;

  @IsNotEmpty()
  @IsString()
  linkedin_link: string;

  @IsNotEmpty()
  @IsString()
  google_link: string;

  @IsNotEmpty()
  @IsString()
  instagram_link: string;

  @IsNotEmpty()
  @IsEnum(['Yes', 'No'])
  access_pdf_by_email: string;

  @IsOptional()
  @IsString()
  brand_feature_image: string;
}