import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ClaimProfile } from '../entities/claim-profile.entity';

@Injectable()
export class ClaimProfileRepository extends Repository<ClaimProfile> {
  constructor(private dataSource: DataSource) {
    super(ClaimProfile, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<ClaimProfile> {
    const callschedule = await this.findOne({ where: { id } });
    if (!callschedule) {
      throw new NotFoundException();
    }
    return callschedule;
  }
}
