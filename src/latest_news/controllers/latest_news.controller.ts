import { Controller, Get, Query } from '@nestjs/common';
import { LatestNewsService } from '../services/latest_news.service';
import { LatestNewsDto } from '../dtos/latestNewsDto';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';

@Controller({
  version: '1',
  path: 'latest-news',
})
export class LatestNewsController {
  constructor(private service: LatestNewsService) {}

  @Get()
  async list(
    @Query() filter: LatestNewsDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.service.listLatestNews(filter, pageOptionsDto);
  }
}
