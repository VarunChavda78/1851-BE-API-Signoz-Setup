import { Controller } from '@nestjs/common';
import { MediaRepository } from '../repositories/media.repository';
import { MediaService } from '../services/media.service';

@Controller({
  version: '1',
  path: 'media',
})
export class MediaController {
  constructor(
    private repository: MediaRepository,
    private service: MediaService,
  ) {}
}
