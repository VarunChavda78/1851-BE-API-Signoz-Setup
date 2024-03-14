import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { UniversityService } from './services/university.service';
import { FilterDto, PayloadDto} from './dtos/UniversityDto';
import { Response } from 'express';

@Controller({
    version: '1',
    path: 'university',
  })
export class UniversityController {
    constructor(
        private service : UniversityService,
    ){}

    @Get()
    async list(
        @Query() filterDto : FilterDto,
    ) {
      const data = await this.service.getList(filterDto);
      return { data: [ ...data ] };
    }
  
    @Post()
    async create(@Body() payload:PayloadDto, @Res() res: Response) {
        try {
            await this.service.createUniversity(payload);
            return res.status(HttpStatus.CREATED).json({
              statusCode: HttpStatus.CREATED,
              status: 'University resources created successfully',
            });
          } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'Failed to create university resources',
            });
          }
    }

    @Delete(':id')
    async delete(@Param('id') id:number, @Res() res: Response) {
      try {
        await this.service.deleteUniversity(id);
        return res.status(HttpStatus.OK).json({
              statusCode: HttpStatus.OK,
              status: 'University resource deleted successfully',
        }); 
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete university resource',
        });
      }
    }
  

}
