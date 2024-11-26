import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { SiteLog } from '../mysqldb/entities/site-log-entity';
import { GetSiteLogDto,SiteLogResponse,PaginatedSiteLogResponse } from './dtos/site-log-dto';
import { CommonService } from '../shared/services/common.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class SiteLogService {
  constructor(
    @InjectRepository(SiteLog, 'mysqldb')
    private readonly siteLogRepository: Repository<SiteLog>,
    private commonService: CommonService,
    private configservice: ConfigService,
  ) {}

  async getSiteLogs(filter: GetSiteLogDto): Promise<PaginatedSiteLogResponse> {
    const { type, loginDate, page = 1, limit = 10, search ,keywordSearch, sortBy = 'date', sortOrder = 'ASC' } = filter;


    const query = this.siteLogRepository
      .createQueryBuilder('sitelog')
      .leftJoin('registration', 'reg', 'sitelog.brandId = reg.id')
      .select([
        `CASE 
          WHEN sitelog.type = 'user' THEN CONCAT(:imageUrl, reg.brandLogo)
          ELSE CONCAT(:imageUrl, reg.photo)
         END as image`,
         `CASE 
         WHEN sitelog.type = 'user' THEN reg.company
         ELSE reg.user_name
        END as username`,
        'sitelog.type as type',
        'DATE(sitelog.loginDate) as date',
        'sitelog.loginTime as loginTime',
        'sitelog.logoutTime as logoutTime',
        'TIMEDIFF(sitelog.logoutTime, sitelog.loginTime) as totalLogTime'
      ]).setParameter('imageUrl', `${this.configservice.get('s3.imageUrl')}/`);


    if (type) {
      query.where('sitelog.type = :type', { type });
    }
  
    if (loginDate) {
      query.andWhere('DATE(sitelog.loginDate) = :loginDate', { loginDate });
    }
  
    if (search) {
      query.andWhere('(LOWER(reg.company) LIKE LOWER(:search) OR LOWER(reg.user_name) LIKE LOWER(:search))', { search: `%${search}%` });
    }

    if (filter.keywordSearch) {
      const keywordSearch = `%${filter.keywordSearch}%`;
    
      query.andWhere(
        `(LOWER(reg.user_name) LIKE LOWER(:keywordSearch)
        OR LOWER(reg.company) LIKE LOWER(:keywordSearch)
        OR LOWER(sitelog.type) LIKE LOWER(:keywordSearch)
        OR DATE_FORMAT(sitelog.loginDate, '%Y-%m-%dT00:00:00.000Z') LIKE :keywordSearch
        OR DATE_FORMAT(sitelog.loginTime, '%Y-%m-%dT%H:%i:%s.000Z') LIKE :keywordSearch
        OR DATE_FORMAT(sitelog.logoutTime, '%Y-%m-%dT%H:%i:%s.000Z') LIKE :keywordSearch
        OR TIME_FORMAT(TIMEDIFF(sitelog.logoutTime, sitelog.loginTime), '%H:%i:%s') LIKE :keywordSearch)`,
        { keywordSearch }
      );
    }
    

  
    const totalRecords = await query.getCount();
    const validSortFields = ['date', 'username', 'type', 'loginTime', 'logoutTime', 'totalLogTime'];
  

    if (validSortFields.includes(sortBy)) {
      switch (sortBy) {
        case 'date':
          query.orderBy('sitelog.loginDate', sortOrder);
          break;
        case 'username':
          query.orderBy(
            'CASE WHEN reg.user_type = "user" THEN reg.user_name ELSE reg.company END',
            sortOrder
          );
          break;
        case 'loginTime':
          if (sortOrder === 'ASC') {
            // For ascending, sort from earliest date to latest, then earliest time to latest
            query.orderBy('sitelog.loginDate', 'ASC')
                 .addOrderBy('sitelog.loginTime', 'ASC');
          } else {
            // For descending, sort from latest date to earliest, then latest time to earliest
            query.orderBy('sitelog.loginDate', 'DESC')
                 .addOrderBy('sitelog.loginTime', 'DESC');
          }
          break;
        case 'logoutTime':
          query.orderBy('sitelog.loginDate', sortOrder)
              .addOrderBy('sitelog.logoutTime', sortOrder);
          break;
        case 'totalLogTime':
          query.orderBy('TIMEDIFF(sitelog.logoutTime, sitelog.loginTime)', sortOrder);
          break;
        case 'type':
          query.orderBy('reg.user_type', sortOrder);
          break;
      }
    } else {
      // Default sorting
      query.orderBy('sitelog.loginDate', 'ASC');
    }
  
    // Add pagination
    query.skip((page - 1) * limit).take(limit);

    const results = await query.getRawMany();
    
    const data = results.map(result => ({
      image: result.image,
      username: result.username,
      type: result.type,
      date: result.date,
      loginTime: result.loginTime,
      logoutTime: result.logoutTime,
      totalLogTime: result.totalLogTime
    }));

    const pagination = this.commonService.getPagination(totalRecords, limit, page);

    return {
      data,
      pagination
    };
  }
}
