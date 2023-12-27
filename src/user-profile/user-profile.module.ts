import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserProfile } from './entities/user-profile.entity';
import { UserProfileService } from './services/user-profile.service';
import { UserProfileRepository } from './repositories/user-profile.repository';
import { UserProfileController } from './controllers/user-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile])],
  providers: [UserProfileService, UserProfileRepository, ConfigService],
  controllers: [UserProfileController],
  exports: [UserProfileService],
})
export class UserProfileModule {}
