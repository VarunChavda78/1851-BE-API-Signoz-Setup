import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Highlight } from '../highlight.entity';

@Injectable()
export class HighlightRepository extends Repository<Highlight> {
  constructor(private dataSource: DataSource) {
    super(Highlight, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Highlight> {
    const highlight = await this.findOne({ where: { id } });
    if (!highlight) {
      throw new NotFoundException();
    }
    return highlight;
  }
}
