import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from './testimonial.entity';
import { TestimonialRepository } from './repositories/testimonial.repository';
import { TestimonialService } from './services/testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonial])],
  providers: [TestimonialService, TestimonialRepository, ConfigService],
  controllers: [TestimonialController],
  exports: [TestimonialService],
})
export class TestimonialModule {}
