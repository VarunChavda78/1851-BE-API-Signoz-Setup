import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocialPlatformDto {
  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}

export enum SocialPlatforms {
  FACEBOOK = 1,
  LINKEDIN = 2,
  YOUTUBE = 3,
  INSTAGRAM = 4,
}
