import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Media } from '../media.entity';

@Injectable()
export class MediaRepository extends Repository<Media> {
  constructor(private dataSource: DataSource) {
    super(Media, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Media> {
    const media = await this.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException();
    }
    return media;
  }
}
