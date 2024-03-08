import { UniversityController } from './university.controller';
import { UniversityService } from './services/university.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { University } from './university.entity';
import { UniversityRepository } from './respositories/university.repository';
import { ConfigModule } from '@nestjs/config'; 

@Module({
  imports: [TypeOrmModule.forFeature([University]), ConfigModule], 
  controllers: [UniversityController],
  providers: [UniversityService, UniversityRepository],
  exports: [UniversityService, UniversityRepository]
})
export class UniversityModule {}
