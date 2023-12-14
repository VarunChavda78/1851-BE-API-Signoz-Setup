import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimProfile } from './entities/claim-profile.entity';
import { ClaimProfileService } from './services/claim-profile.service';
import { ClaimProfileRepository } from './repositories/claim-profile.repository';
import { ClaimProfileController } from './controllers/claim-profile.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ClaimProfile])],
  providers: [ClaimProfileService, ClaimProfileRepository, ConfigService],
  controllers: [ClaimProfileController],
  exports: [ClaimProfileService],
})
export class ClaimProfileModule {}
