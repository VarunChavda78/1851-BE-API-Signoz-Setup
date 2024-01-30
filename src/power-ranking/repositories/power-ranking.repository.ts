import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PowerRanking } from '../power-ranking.entity';

@Injectable()
export class PowerRankingRepository extends Repository<PowerRanking> {
  constructor(private dataSource: DataSource) {
    super(PowerRanking, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<PowerRanking> {
    const powerRanking = await this.findOne({ where: { id } });
    if (!powerRanking) {
      throw new NotFoundException();
    }
    return powerRanking;
  }
}
