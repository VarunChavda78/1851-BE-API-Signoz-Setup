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
    async create(@Body() universityItem: UniverstiyDto, @Res() res: Response) {
        try {
            await this.service.createUniversity(universityItem);
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                status: 'University resource created successfully',
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to create university resource',
            });
        }
    }
  

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() item: UniverstiyDto,
        @Res() res: Response,
    ) {
        const existingUniversity = await this.repository.getById(id);
        if (!existingUniversity) {
            return res.status(HttpStatus.NOT_FOUND).json({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'University not found',
            });
        }

        try {
            existingUniversity.heading = item.heading;
            existingUniversity.url = item.url;
            existingUniversity.image = item.image;
            existingUniversity.pdf = item.pdf;
            existingUniversity.type = item.type;
            existingUniversity.updated_by = item.updated_by;
            await this.repository.save(existingUniversity);
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'University resource updated successfully',
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to update university resource',
            });
        }
    }


}
