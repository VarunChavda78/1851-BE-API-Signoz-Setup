import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SlugHistory } from '../slug-history.entity';
import { SlugObjectType } from '../dtos/SlugHistoryDto';

@Injectable()
export class SlugHistoryRepository extends Repository<SlugHistory> {
  constructor(private dataSource: DataSource) {
    super(SlugHistory, dataSource.createEntityManager());
  }

  async getBySupplierId(supplierId: number): Promise<SlugHistory[]>{
    const history = await this.find({ where: { objectId: supplierId, objectType: SlugObjectType.OBJECT_TYPE_SUPPLIER} });
    if (!history) {
      throw new NotFoundException();
    }
    return history;
  }


  async getBySlug(slug: string): Promise<SlugHistory> {
    const history = await this.findOne({ where: { slug } });
    if (!history) {
      throw new NotFoundException();
    }
    return history;
  }

  async getById(id: number): Promise<SlugHistory> {
    const history = await this.findOne({ where: { id } });
    if (!history) {
      throw new NotFoundException();
    }
    return history;
  }
}
