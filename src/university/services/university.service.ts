import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversityRepository } from '../respositories/university.repository';
import { PayloadDto } from '../dtos/UniversityDto';
import { University } from '../university.entity';
import { FilterDto } from '../dtos/UniversityDto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UniversityService {
    constructor(
        private repository: UniversityRepository,
        private config : ConfigService,
    ){}


    async getList(filterDto : FilterDto) {
      const {type} = filterDto
      const queryBuilder = await this.repository
        .createQueryBuilder('university')
        .where('university.type = :type', {
          type: type,
        }).limit(4)
       
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
              imageUrl : data?.image
                    ? `${this.config.get(
                      's3.imageUrl',
                    )}/university/image/${data?.image}`
                  : '',
                pdfUrl : data?.pdf 
                    ? `${this.config.get(
                      's3.imageUrl',
                    )}/university/pdf/${data?.pdf}`
                  : '',
              pdf : data?.pdf ?? '',
              type : data?.type ?? '',
              created_at : data?.created_at ?? '',
          }        
    }

    async createUniversity(payload: PayloadDto, createdBy?: number): Promise<boolean>  {
      const resources = payload.resources;
      
      for (let value of resources){
        let university = await this.repository.findOne({ where: { type: value.type, id:value.id || 0} });
        if (!university) {
          university = new University();
          university.created_by = value.created_by;   
        }
        university.heading = value.heading ?? '';
        university.url = value.url ?? '';
        university.pdf = value.pdf ?? '';
        university.image = value.image ?? '';
        university.type = value.type ;
        university.updated_by = value.updated_by;
        await this.repository.save(university);
      }
      return true
    }

    async deleteUniversity(id:number): Promise<void> {
      const university = await this.repository.findOne({where : {id:id}});
      if (!university) {
          throw new NotFoundException('Resource not found'); 
      }

      await this.repository.remove(university);
  }


}
