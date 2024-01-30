import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PowerRanking } from './power-ranking.entity';
import { PowerRankingRepository } from './repositories/power-ranking.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PowerRanking])],
  providers: [PowerRankingRepository, ConfigService],
  controllers: [],
  exports: [],
})
export class PowerRankingModule {}
