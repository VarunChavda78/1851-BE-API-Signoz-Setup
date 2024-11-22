import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteLog } from '../mysqldb/entities/site-log-entity';
import { GetSiteLogDto,SiteLogResponse } from './dtos/site-log-dto';

@Injectable()
export class SiteLogService {
  constructor(
    @InjectRepository(SiteLog, 'mysqldb')
    private readonly siteLogRepository: Repository<SiteLog>,
  ) {}

  async getSiteLogs(filter: GetSiteLogDto): Promise<SiteLogResponse[]> {
    const { type, loginDate, search } = filter;
  
    const query = this.siteLogRepository
      .createQueryBuilder('sitelog')
      .leftJoinAndSelect('sitelog.registration', 'registration')
      .select([
        `CASE 
          WHEN registration.user_type = 'user' THEN registration.brandLogo
          WHEN registration.user_type = 'author' THEN registration.photo
         END as image`,
        'registration.company as username',
        'registration.user_type as type',
        'DATE(sitelog.loginDate) as date',
        'TIME(sitelog.loginTime) as loginTime',
        'TIME(sitelog.logoutTime) as logoutTime',
        'TIMEDIFF(sitelog.logoutTime, sitelog.loginTime) as totalLogTime'
      ]);
  
    if (type) {
      query.where('sitelog.type = :type', { type });
    }
  
    if (loginDate) {
      query.andWhere('DATE(sitelog.loginDate) = :loginDate', { loginDate });
    }
  
    if (search) {
      query.andWhere('LOWER(registration.company) LIKE LOWER(:search)', { search: `%${search}%` });
    }
  
    const results = await query.getRawMany();
    
    return results.map(result => ({
      image: result.image,
      username: result.username,
      type: result.type,
      date: result.date,
      loginTime: result.loginTime,
      logoutTime: result.logoutTime,
      totalLogTime: result.totalLogTime
    }));
  }
}
