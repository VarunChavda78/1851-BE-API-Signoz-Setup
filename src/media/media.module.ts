import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MediaService } from './services/media.service';
import { MediaRepository } from './repositories/media.repository';
import { MediaController } from './controllers/media.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  providers: [MediaService, MediaRepository],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
