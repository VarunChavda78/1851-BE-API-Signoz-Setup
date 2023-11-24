import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { TestimonialRepository } from './repositories/testimonial.repository';
import { TestimonialService } from './services/testimonial.service';
import { TestimonialController } from './controllers/testimonial.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonial])],
  providers: [TestimonialService, TestimonialRepository],
  controllers: [TestimonialController],
  exports: [TestimonialService],
})
export class TestimonialModule {}
