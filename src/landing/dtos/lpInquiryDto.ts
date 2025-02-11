import { IsArray, IsEmail, ArrayMinSize } from 'class-validator';
export class UpdateLpInquiryDto {
  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayMinSize(0)
  emails: string[];
}
