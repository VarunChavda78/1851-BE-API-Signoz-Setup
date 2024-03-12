import { UniversityController } from './university.controller';
import { UniversityService } from './services/university.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { University } from './university.entity';
import { UniversityRepository } from './respositories/university.repository';
import { ConfigModule, ConfigService } from '@nestjs/config'; 

@Module({
  imports: [TypeOrmModule.forFeature([University]), ConfigModule], 
  controllers: [UniversityController],
  providers: [UniversityService, UniversityRepository, ConfigService],
  exports: [UniversityService, UniversityRepository]
})
export class UniversityModule {}
