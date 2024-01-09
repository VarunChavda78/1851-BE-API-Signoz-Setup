import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SocialPlatform } from '../social-platform.entity';

@Injectable()
export class SocialPlatformRepository extends Repository<SocialPlatform> {
  constructor(private dataSource: DataSource) {
    super(SocialPlatform, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<SocialPlatform> {
    const social = await this.findOne({ where: { id } });
    if (!social) {
      throw new NotFoundException();
    }
    return social;
  }
}
