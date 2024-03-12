import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { UniversityRepository } from './respositories/university.repository';
import { UniversityService } from './services/university.service';
import { University } from './university.entity';
import { FilterDto, UniverstiyDto } from './dtos/UniversityDto';
import { Response } from 'express';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

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
    async list(
        @Query() filterData : FilterDto,
        @Query() pageOptions : PaginationDto,
    ) {
      const data = await this.service.getList(filterData,pageOptions);
      return { data: data };
    }
  
    @Get(':id')
    async show(@Param('id') id: number) {
      const item: University = await this.repository.getById(id);
      let data = {};
      if(item){
        data = await this.service.getDetails(item);
      }
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
