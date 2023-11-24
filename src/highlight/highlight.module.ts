import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Highlight } from './entities/highlight.entity';
import { HighlightService } from './services/highlight.service';
import { HighlightRepository } from './repositories/highlight.repository';
import { HighlightController } from './controllers/highlight.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Highlight])],
  providers: [HighlightService, HighlightRepository],
  controllers: [HighlightController],
  exports: [HighlightService],
})
export class HighlightModule {}
