import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFaqDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  answer: string;
}
