import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Testimonial } from '../testimonial.entity';

@Injectable()
export class TestimonialRepository extends Repository<Testimonial> {
  constructor(private dataSource: DataSource) {
    super(Testimonial, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Testimonial> {
    const testimonial = await this.findOne({ where: { id } });
    if (!testimonial) {
      throw new NotFoundException();
    }
    return testimonial;
  }
}
