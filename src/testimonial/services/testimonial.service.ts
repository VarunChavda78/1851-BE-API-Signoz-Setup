import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestimonialService {
  constructor(private readonly config: ConfigService) {}

  async getDetails(testimonial) {
    let data = {};
    if (testimonial) {
      data = {
        id: testimonial?.id,
        name: testimonial?.name,
        designation: testimonial?.designation,
        title: testimonial?.title,
        description: testimonial?.description,
        image: `${this.config.get(
          's3.imageUrl',
        )}/supplier-db/testimonial/${testimonial?.image}`,
      };
    }
    return data;
  }
}
