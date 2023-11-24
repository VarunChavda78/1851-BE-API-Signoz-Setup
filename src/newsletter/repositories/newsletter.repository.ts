import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Newsletter } from '../entities/newsletter.entity';

@Injectable()
export class NewsletterRepository extends Repository<Newsletter> {
  constructor(private dataSource: DataSource) {
    super(Newsletter, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Newsletter> {
    const newsletter = await this.findOne({ where: { id } });
    if (!newsletter) {
      throw new NotFoundException();
    }
    return newsletter;
  }
}
