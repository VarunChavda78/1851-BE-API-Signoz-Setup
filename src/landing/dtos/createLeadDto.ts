import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  gReCaptchaToken: string;

  @IsNumber()
  @IsOptional()
  lpId?: number;

  @IsNumber()
  @IsOptional()
  type?: number;

  @IsNumber()
  @IsOptional()
  formType?: number;

  @IsString()
  @IsOptional()
  email?: string;

  [key: string]: any;

  @IsString()
  hostname?: string;
}
