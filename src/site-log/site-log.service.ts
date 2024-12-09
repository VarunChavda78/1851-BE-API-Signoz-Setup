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


async getSiteLogs(filter: GetSiteLogDto): Promise<PaginatedSiteLogResponse> {
  try {
    const { 
      type,  
      loginDate,
      page = 1, 
      limit = 10, 
      search,
      keywordSearch,
      sortBy = 'date', 
      sortOrder = 'ASC',
      startDate='',
      endDate=''
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

    if (type && startDate && endDate) {
      const startDateTime = new Date(startDate).toISOString(); // Start date
      const endDateTime = new Date(new Date(endDate).setHours(23, 59, 59, 999)).toISOString(); // End date including full day
    
      query.where('sitelog.type = :type', { type })
           .andWhere('sitelog.loginTime BETWEEN :startDateTime AND :endDateTime', {
             startDateTime,
             endDateTime
           });
    } else {
      if (type) {
        query.where('sitelog.type = :type', { type });
      }
      if (startDate && endDate) {
        const startDateTime = new Date(startDate).toISOString();
        const endDateTime = new Date(new Date(endDate).setHours(23, 59, 59, 999)).toISOString();
        
        query.andWhere('sitelog.loginTime  BETWEEN :startDateTime AND :endDateTime', {
          startDateTime,
          endDateTime
        });
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
  
  const filteredData = keywordSearch
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
      : (search
        ? dataWithRegistration.filter((item) => {
            const searchTerm = search.toLowerCase();
            return item.username?.toLowerCase().includes(searchTerm);
          })
        : dataWithRegistration);
  
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
  }catch (error) {
    console.log(error);
    throw error;
  }
}

}

