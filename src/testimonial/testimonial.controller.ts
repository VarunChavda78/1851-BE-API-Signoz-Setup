import { Controller, Get } from '@nestjs/common';
import { TestimonialRepository } from './repositories/testimonial.repository';
import { TestimonialService } from './services/testimonial.service';

@Controller({
  version: '1',
  path: 'testimonial',
})
export class TestimonialController {
  constructor(
    private repository: TestimonialRepository,
    private service: TestimonialService,
  ) {}

  @Get()
  async show() {
    const query = this.repository.createQueryBuilder('testimonial');
    const testimonial = await query.getOne();
    const data = await this.service.getDetails(testimonial);
    return { data: data };
  }
}
