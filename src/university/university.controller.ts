import { Body, Controller, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { UniversityRepository } from './respositories/university.repository';
import { UniversityService } from './services/university.service';
import { University } from './university.entity';
import { UniverstiyDto } from './dtos/UniversityDto';
import { Response } from 'express';

@Controller({
    version: '1',
    path: 'university',
  })
export class UniversityController {
    constructor(
        private repository: UniversityRepository,
        private service : UniversityService,
    ){}

    @Get()
    async list() {
      const universityItems = await this.repository.find();
      const data = await this.service.getDetails(universityItems);
      return { data: data };
    }
  
    @Get(':id')
    async show(@Param('id') id: number) {
      const item: University = await this.repository.getById(id);
      const data = {
                heading : item.heading,
                url : item.url,
                image : item.image,
                pdf : item.pdf,
                type : item.type,
                created_by : item.created_by,
                updated_by : item.updated_by,
                created_at : item.created_at,
                updated_at : item.updated_at,
      };
      return { data: data };
    }
  
    @Post()
    async create(@Body() universityItem: UniverstiyDto, @Res() res:Response) {
        await this.service.createUniversity(universityItem);
        return res.status(HttpStatus.CREATED).json({
          statusCode: HttpStatus.CREATED,
          status: 'University resource created successfully',
      });
    }
  
    @Put(':id')
    async update(@Param('id') id: number, @Body() item: UniverstiyDto) {
      const isExist = await this.repository.getById(id);
      if (isExist) {
        await this.repository.update({ id }, { 
            heading : item.heading,
            url : item.url,
            image : item.image,
            pdf : item.pdf,
            type : item.type,
         });
        return {
          statusCode: HttpStatus.CREATED,
          status: 'University resource updated successfully',
        };
      }
    }
}
