import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SocialPlatform } from './entities/social-platform.entity';
import { SocialPlatformService } from './services/social-platform.service';
import { SocialPlatformRepository } from './repositories/social-platform.repository';
import { SocialPlatformController } from './controllers/social-platform.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SocialPlatform])],
  providers: [SocialPlatformService, SocialPlatformRepository, ConfigService],
  controllers: [SocialPlatformController],
  exports: [SocialPlatformService],
})
export class SocialPlatformModule {}
