import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { LatestNews } from '../latest-news.entity';

@Injectable()
export class LatestNewsRepository extends Repository<LatestNews> {
  constructor(private dataSource: DataSource) {
    super(LatestNews, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<LatestNews> {
    const news = await this.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException();
    }
    return news;
  }
}
