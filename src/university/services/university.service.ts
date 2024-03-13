import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversityRepository } from '../respositories/university.repository';
import { PayloadDto, UniverstiyDto } from '../dtos/UniversityDto';
import { University } from '../university.entity';
import { FilterDto } from '../dtos/UniversityDto';

@Injectable()
export class UniversityService {
    constructor(
        private repository: UniversityRepository,
    ){}


    async getList(filterDto : FilterDto) {
      const {type} = filterDto
      const queryBuilder = await this.repository
        .createQueryBuilder('university')
        .where('university.type = :type', {
          type: type,
        })
       
      const universityItems = await queryBuilder
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

    async createUniversity(payload: PayloadDto, createdBy?: number): Promise<boolean>  {
      const resources = payload.resources;
      
      for (let value of resources){
        const resource = await this.repository.findOne({ where: { type: value.type } });
        if (!resource && value.heading !== '') {
          const university = new University();
          university.heading = value.heading ?? '';
          university.url = value.url ?? '';
          university.pdf = value.pdf ?? '';
          university.image = value.image ?? '';
          university.type = value.type ;
          university.created_by = value.created_by;
          university.updated_by = value.updated_by;
          await this.repository.save(university);
      }else if(resource){
          resource.heading = value.heading ?? '';
          resource.url = value.url ?? '';
          resource.pdf = value.pdf ?? '';
          resource.image = value.image ?? '';
          resource.type = value.type ;
          resource.created_by = value.created_by;
          resource.updated_by = value.updated_by;
          await this.repository.save(resource);
      }
    }
    return true
  }

}
