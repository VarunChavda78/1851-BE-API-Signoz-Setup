import { Controller, Get, Query } from '@nestjs/common';
import { SiteLogService } from './site-log.service';
import { GetSiteLogDto, SiteLogResponse } from './dtos/site-log-dto';
import { SiteLog } from '../mysqldb/entities/site-log-entity';

@Controller('site-log')
export class SiteLogController {
  constructor(private readonly siteLogService: SiteLogService) {}

  @Get()
  async getSiteLogs(@Query() filter: GetSiteLogDto): Promise<SiteLogResponse[]> {
    return this.siteLogService.getSiteLogs(filter);
  }
}
