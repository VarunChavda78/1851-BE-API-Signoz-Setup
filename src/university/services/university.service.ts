import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversityRepository } from '../respositories/university.repository';
import { UniverstiyDto } from '../dtos/UniversityDto';
import { University } from '../university.entity';
import { FilterDto } from '../dtos/UniversityDto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class UniversityService {
    constructor(
        private repository: UniversityRepository,
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
              id : data?.id ?? '',
              heading : data?.heading ?? '',
              url : data?.url ?? '',
              image : data?.image ?? '',
              pdf : data?.pdf ?? '',
              type : data?.type ?? '',
              created_at : data?.created_at ?? '',
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
         const university = new University();
         university.heading = heading;
         university.url = url;
         university.pdf = pdf;
         university.image = image;
         university.type = type;
         university.created_by = created_by;
         university.updated_by = updated_by;
        const item = await this.repository.save(university);
        if (!item) {
          throw new NotFoundException();
        }
        return item;
      }

}
