import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserProfile } from '../entities/user-profile.entity';

@Injectable()
export class UserProfileRepository extends Repository<UserProfile> {
  constructor(private dataSource: DataSource) {
    super(UserProfile, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<UserProfile> {
    const profile = await this.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException();
    }
    return profile;
  }
}
