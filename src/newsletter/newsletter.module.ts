import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Newsletter } from './entities/newsletter.entity';
import { NewsletterRepository } from './repositories/newsletter.repository';
import { NewsletterService } from './services/newsletter.service';
import { NewsletterController } from './controllers/newsletter.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Newsletter])],
  providers: [NewsletterService, NewsletterRepository],
  controllers: [NewsletterController],
  exports: [NewsletterService],
})
export class NewsletterModule {}
