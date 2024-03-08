import { UniversityController } from './university.controller';
import { UniversityService } from './services/university.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { University } from './university.entity';
import { UniversityRepository } from './respositories/university.repository';
import { ConfigService } from 'aws-sdk';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports : [TypeOrmModule.forFeature([University])],
  controllers: [UniversityController],
  providers: [
    UniversityService,
    UniversityRepository,
    ConfigService,
    ConfigModule
  ],
  exports: [UniversityService, UniversityRepository]
})
export class UniversityModule {}
