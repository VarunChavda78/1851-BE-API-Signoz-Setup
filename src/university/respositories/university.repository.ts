import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { University } from '../university.entity';

@Injectable()
export class UniversityRepository extends Repository<University> {
  constructor(
    private dataSource: DataSource,
    ) {
    super(University, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<University> {
    const franchise = await this.findOne({ where: { id } });
    if (!franchise) {
      throw new NotFoundException();
    }
    return franchise;
  }

}
