import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversityRepository } from '../respositories/university.repository';
import { UniverstiyDto } from '../dtos/UniversityDto';
import { University } from '../university.entity';
import { ConfigService } from '@nestjs/config';
import { FilterDto } from '../dtos/UniversityDto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class UniversityService {
    constructor(
        private repository: UniversityRepository,
        private config : ConfigService,
    ){}


    async getList(filterData: FilterDto, pageOptions : PaginationDto) {
      const {
        page = 1,
        limit = 10,
        order = 'DESC',
        sort = 'created_at',
      }: any = pageOptions;
      const skip = ((pageOptions?.page > 0 ? pageOptions?.page: 1) - 1) * limit;
      const { type} = filterData;
      const queryBuilder = await this.repository
        .createQueryBuilder('university')
        .where('university.type = :type', {
          type: type,
        }).orderBy(sort, order )
       
      const itemCount = await queryBuilder.getCount();
      const universityItems = await queryBuilder
        .skip(skip)
        .take(limit)
        .getMany();
        const details = [];
        if (universityItems.length) {
          for (const data of universityItems) {
            details.push(await this.getDetails(data));
          }
        }
        return details;
    }

    async getDetails(data) {
      return {
              heading : data?.heading,
              url : data?.url,
              image : data?.image
                  ? `${this.config.get(
                    's3.imageUrl',
                  )}/university/image/${data?.image}`
                : '',
              pdf : data?.pdf 
                  ? `${this.config.get(
                    's3.imageUrl',
                  )}/university/pdf/${data?.pdf}`
                : '',
              type : data?.type,
              created_at : data?.created_at,
          }        
    }

    async createUniversity(createUniversityDto: UniverstiyDto): Promise<University> {
        const { 
            heading,
            url,
            image,
            pdf,
            type,
            created_by,
            updated_by
         } = createUniversityDto;
        const item = await this.repository.create({
            heading,
            url,
            image,
            pdf,
            type,
            created_by,
            updated_by
        });
    
        if (!item) {
          throw new NotFoundException();
        }
    
        await this.repository.save(item);
        return item;
      }

}
