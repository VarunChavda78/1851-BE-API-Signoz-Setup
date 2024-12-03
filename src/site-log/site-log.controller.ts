import { Controller, Get, Query,HttpException,HttpStatus} from '@nestjs/common';
import { SiteLogService } from './site-log.service';
import { GetSiteLogDto ,PaginatedSiteLogResponse} from './dtos/site-log-dto';

@Controller({
  path: 'site-log',
  version: '1',
})
export class SiteLogController {
  constructor(private readonly siteLogService: SiteLogService) {}

  @Get()
  async getSiteLogs(@Query() filter: GetSiteLogDto): Promise<PaginatedSiteLogResponse> {
    try{
      return await this.siteLogService.getSiteLogs(filter);
      }catch (error) {
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'Sitelog information not found',
    }, HttpStatus.NOT_FOUND);
  }
}
}
