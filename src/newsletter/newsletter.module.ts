import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Newsletter } from './newsletter.entity';
import { NewsletterRepository } from './repositories/newsletter.repository';
import { NewsletterService } from './services/newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Newsletter]), HttpModule],
  providers: [NewsletterService, NewsletterRepository, ConfigService],
  controllers: [NewsletterController],
  exports: [NewsletterService],
})
export class NewsletterModule {}
