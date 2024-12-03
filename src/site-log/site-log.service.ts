import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { SiteLog } from '../mysqldb/entities/site-log-entity';
import { GetSiteLogDto,SiteLogResponse,PaginatedSiteLogResponse } from './dtos/site-log-dto';
import { CommonService } from '../shared/services/common.service';
import { ConfigService } from '@nestjs/config';
import { Registration } from 'src/mysqldb/entities/registration.entity';


@Injectable()
export class SiteLogService {
  constructor(
    @InjectRepository(SiteLog, 'mysqldb')
    private readonly siteLogRepository: Repository<SiteLog>,
    @InjectRepository(Registration, 'mysqldb')
    private usersRepository: Repository<Registration>,
    private commonService: CommonService,
    private configservice: ConfigService,
  ) {}

  // async getSiteLogs(filter: GetSiteLogDto): Promise<PaginatedSiteLogResponse> {
  //   const { type, loginDate, page = 1, limit = 10, search ,keywordSearch, sortBy = 'date', sortOrder = 'ASC' } = filter;


  //   const query = this.siteLogRepository
  //     .createQueryBuilder('sitelog')
  //     .leftJoin('registration', 'reg', 'sitelog.brandId = reg.id')
  //     .select([
  //       `CASE 
  //         WHEN sitelog.type = 'user' THEN CONCAT(:imageUrl,'brand/logo/', reg.brandLogo)
  //         ELSE CONCAT(:imageUrl,sitelog.type,'/', reg.photo)
  //        END as image`,
  //        `CASE 
  //        WHEN sitelog.type = 'user' THEN reg.company
  //        ELSE reg.user_name
  //       END as username`,
  //       'sitelog.type as type',
  //       'DATE(sitelog.loginDate) as date',
  //       'sitelog.loginTime as loginTime',
  //       'sitelog.logoutTime as logoutTime',
  //       'TIMEDIFF(sitelog.logoutTime, sitelog.loginTime) as totalLogTime'
  //     ]).setParameter('imageUrl', `${this.configservice.get('s3.imageUrl')}/`);


  //   if (type) {
  //     query.where('sitelog.type = :type', { type });
  //   }
  
  //   if (loginDate) {
  //     query.andWhere('DATE(sitelog.loginDate) = :loginDate', { loginDate });
  //   }
  
  //   if (search) {
  //     query.andWhere('(LOWER(reg.company) LIKE LOWER(:search) OR LOWER(reg.user_name) LIKE LOWER(:search))', { search: `%${search}%` });
  //   }

  //   if (filter.keywordSearch) {
  //     const keywordSearch = `%${filter.keywordSearch}%`;
    
  //     query.andWhere(
  //       `(LOWER(reg.user_name) LIKE LOWER(:keywordSearch)
  //       OR LOWER(reg.company) LIKE LOWER(:keywordSearch)
  //       OR LOWER(sitelog.type) LIKE LOWER(:keywordSearch)
  //       OR DATE_FORMAT(sitelog.loginDate, '%Y-%m-%dT00:00:00.000Z') LIKE :keywordSearch
  //       OR DATE_FORMAT(sitelog.loginTime, '%Y-%m-%dT%H:%i:%s.000Z') LIKE :keywordSearch
  //       OR DATE_FORMAT(sitelog.logoutTime, '%Y-%m-%dT%H:%i:%s.000Z') LIKE :keywordSearch
  //       OR TIME_FORMAT(TIMEDIFF(sitelog.logoutTime, sitelog.loginTime), '%H:%i:%s') LIKE :keywordSearch)`,
  //       { keywordSearch }
  //     );
  //   }
    
  //   const totalRecords = await query.getCount();

  //   const validSortFields = ['date', 'username', 'type', 'loginTime', 'logoutTime', 'totalLogTime'];
  

  //   if (validSortFields.includes(sortBy)) {
  //     switch (sortBy) {
  //       case 'date':
  //         query.orderBy('sitelog.loginDate', sortOrder);
  //         break;
  //       case 'username':
  //         query.orderBy(
  //           'CASE WHEN sitelog.type = "user" THEN reg.company ELSE reg.user_name END',
  //           sortOrder
  //         );
  //         break;
  //       case 'loginTime':
  //         query.orderBy(
  //           `DATE(sitelog.loginTime)`, // Sort by date first
  //           sortOrder
  //         ).addOrderBy(
  //           `TIME(sitelog.loginTime)`, // Then sort by time if dates are the same
  //           sortOrder
  //         );
  //         break;
  //       case 'logoutTime':
  //         query.orderBy('DATE(sitelog.logoutTime)',
  //            sortOrder
  //         ). addOrderBy(
  //             'TIME(sitelog.logoutTime)',
  //              sortOrder
  //             );
  //         break;
  //       case 'totalLogTime':
  //         query.orderBy('TIMEDIFF(sitelog.logoutTime, sitelog.loginTime)', sortOrder);
  //         break;
  //       case 'type':
  //         query.orderBy('LOWER(sitelog.type)', sortOrder);
  //         break;
  //             }
  //   } else {
  //     // Default sorting
  //     query.orderBy('sitelog.loginDate', 'ASC');
  //   }
  
  //   // Add pagination
  //   query.skip((page - 1) * limit).take(limit);

  //   const results = await query.getRawMany();
    
  //   const data = results.map(result => ({
  //     image: result.image,
  //     username: result.username,
  //     type: result.type,
  //     date: result.date,
  //     loginTime: result.loginTime,
  //     logoutTime: result.logoutTime,
  //     totalLogTime: result.totalLogTime
  //   }));

  //   const pagination = this.commonService.getPagination(totalRecords, limit, page);

  //   return {
  //     data,
  //     pagination
  //   };
  // }

async getSiteLogs(filter: GetSiteLogDto): Promise<PaginatedSiteLogResponse> {
  const { 
    type, 
    loginDate, 
    page = 1, 
    limit = 10, 
    search,
    keywordSearch,
    sortBy = 'date', 
    sortOrder = 'ASC' 
  } = filter;

  // Helper function to get registration details
  const getRegistrationDetails = async (brandId: number) => {
    try {
      const registration = await this.usersRepository.findOne({
        where: { id: brandId },
        select: ['photo', 'brandLogo', 'company', 'user_name','author_title']
      });

      return registration || {};
    } catch (error) {
      console.error('Error fetching registration details:', error);
      return {};
    }
  };

  // Helper function to create display information
  const createDisplayInfo = (type: string, registration: any) => {
    const imageBaseUrl = `${this.configservice.get('s3.imageUrl')}/`;
    
    if (type === 'user') {
      return {
        image: `${imageBaseUrl}brand/logo/${registration.brandLogo || ''}`,
        username: registration.author_title || ''
      };
    }

    
    return {
      image: `${imageBaseUrl}${type}/${registration.photo || ''}`,
      username: registration.author_title || ''
    };
  };

  const query = this.siteLogRepository
    .createQueryBuilder('sitelog')
    .select(['sitelog']);


  // Apply filters
  if (type && loginDate) {
    query.where('sitelog.type = :type', { type })
         .andWhere('(DATE(sitelog.loginTime) = :loginDate OR DATE(sitelog.logoutTime) = :loginDate)', { loginDate });
  } else {
    if (type) {
      query.where('sitelog.type = :type', { type });
    }
    if (loginDate) {
      query.andWhere('(DATE(sitelog.loginTime) = :loginDate OR DATE(sitelog.logoutTime) = :loginDate)', { loginDate });
    }
  }

  // Sorting logic
  const validSortFields = ['date', 'type', 'loginTime', 'logoutTime'];
  
  if (validSortFields.includes(sortBy)) {
    switch (sortBy) {
      case 'date':
        query.orderBy('sitelog.loginDate', sortOrder);
        break;
      case 'type':
        query.orderBy('LOWER(sitelog.type)', sortOrder);
        break;
      case 'loginTime':
        query.orderBy('sitelog.loginTime', sortOrder);
        break;
      case 'logoutTime':
        query.orderBy('sitelog.logoutTime', sortOrder);
        break;
    }
  } else {
    query.orderBy('sitelog.loginDate', 'ASC');
  }
 
  const results = await query.getMany();
  
  // Transform results with registration details
  const dataWithRegistration = await Promise.all(results.map(async (result) => {
    const registration = await getRegistrationDetails(result.brandId);
    return {
      ...createDisplayInfo(result.type, registration),
      type: result.type,
      date: result.loginDate ? result.loginDate.toString().split('T')[0] : null,
      loginTime: result.loginTime? result.loginTime.toISOString() : '',
      logoutTime: result.logoutTime? result.logoutTime.toISOString() : '',
      totalLogTime: result.totalTime? result.totalTime.toString():''
  }}));

const filteredData = keywordSearch||search
  ? dataWithRegistration.filter((item) => {
      const searchTerm = (keywordSearch||search).toLowerCase();
      return (
        item.username?.toLowerCase().includes(searchTerm) ||
        item.date?.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm) ||
        item.loginTime?.toLowerCase().includes(searchTerm) ||
        item.logoutTime?.toLowerCase().includes(searchTerm) ||
        item.totalLogTime?.toLowerCase().includes(searchTerm)
      );
    })
  : dataWithRegistration;

  // Sort based on username
  if (sortBy === 'username') {
    filteredData.sort((a, b) => {
      const nameA = a.username.toLowerCase();
      const nameB = b.username.toLowerCase();
      if (nameA < nameB) return sortOrder === 'ASC' ? -1 : 1;
      if (nameA > nameB) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    })}
    else if (sortBy === 'totalLogTime') {
      filteredData.sort((a, b) => {
        // Helper function to parse time to seconds
        const parseTimeToSeconds = (timeString: string): number => {
          if (!timeString) return 0;
          const parts = timeString.split(':').map(Number);
          if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
          }
          return 0;
        };
  
        // Convert totalLogTime to a numeric value for comparison
        const timeA = parseTimeToSeconds(a.totalLogTime);
        const timeB = parseTimeToSeconds(b.totalLogTime);
        
        return sortOrder === 'ASC' ? timeA - timeB : timeB - timeA;
      });
  }
  
  // Final Pagination
 
 const totalRecords = filteredData.length;
 const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
 const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

 // Final Pagination
 const pagination = this.commonService.getPagination(totalRecords, limit, page);

 return {
   data: paginatedData,
   pagination
 };
 
}
}

