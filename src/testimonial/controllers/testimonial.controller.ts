import { Controller } from '@nestjs/common';
import { TestimonialRepository } from '../repositories/testimonial.repository';
import { TestimonialService } from '../services/testimonial.service';

@Controller({
  version: '1',
  path: 'testimonial',
})
export class TestimonialController {
  constructor(
    private repository: TestimonialRepository,
    private service: TestimonialService,
  ) {}
}
