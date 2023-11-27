import { Controller } from '@nestjs/common';
import { LatestNewsRepository } from '../repositories/latest_news.repository';
import { LatestNewsService } from '../services/latest_news.service';

@Controller({
  version: '1',
  path: 'news',
})
export class LatestNewsController {
  constructor(
    private repository: LatestNewsRepository,
    private service: LatestNewsService,
  ) {}
}
