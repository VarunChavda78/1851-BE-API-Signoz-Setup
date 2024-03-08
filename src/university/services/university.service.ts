import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversityRepository } from '../respositories/university.repository';
import { UniverstiyDto } from '../dtos/UniversityDto';
import { University } from '../university.entity';

@Injectable()
export class UniversityService {
    constructor(
        private repository: UniversityRepository,
    ){}

    async getDetails(universityItems: University[]) {
        const data = [];
        if (universityItems.length) {
          for (const item of universityItems) {
            data.push({
                heading : item.heading,
                url : item.url,
                image : item.image,
                pdf : item.pdf,
                type : item.type,
                created_by : item.created_by,
                updated_by : item.updated_by,
                created_at : item.created_at,
                updated_at : item.updated_at,
            });
          }
        }
        return data;
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
