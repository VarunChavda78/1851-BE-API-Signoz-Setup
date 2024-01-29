import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PowerRanking } from './power-ranking.entity';
import { PowerRankingService } from './services/power-ranking.service';
import { PowerRankingRepository } from './repositories/power-ranking.repository';
import { PowerRankingController } from './power-ranking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PowerRanking])],
  providers: [PowerRankingService, PowerRankingRepository, ConfigService],
  controllers: [PowerRankingController],
  exports: [PowerRankingService],
})
export class PowerRankingModule {}
