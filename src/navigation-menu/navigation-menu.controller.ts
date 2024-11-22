import { Controller,Post,Body,Get,Put,Delete,Param,NotFoundException,
    HttpStatus,
    HttpException,Query } from '@nestjs/common';
import {NavigationCreateDto,NavigationUpdateDto} from './dtos/navigation-create-dto'
import  {NavigationMenuService} from './navigation-menu.service'

@Controller({
  path: 'navigation-menu',
  version: '1',
})
export class NavigationMenuController {
    constructor(private readonly NavigationMenuService: NavigationMenuService) {}
    @Get()
    async getNavigationMenus(
      @Query('search') search?: string,
      @Query('sortBy') sortBy?: string,
      @Query('order') order: 'ASC' | 'DESC' = 'ASC',
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ) {
      return this.NavigationMenuService.getNavigationMenus(search, sortBy, order, page, limit);
    }
  @Post('create')
  async create(@Body() NavigationCreateDto: NavigationCreateDto) {
    try {
        const result = await this.NavigationMenuService.create(NavigationCreateDto);
        return {
          status: HttpStatus.CREATED,
          message: 'Franchise information created successfully',
          data: result
        };
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Error creating franchise information',
        }, HttpStatus.BAD_REQUEST);
      }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const franchiseInfo = await this.NavigationMenuService.findOne(id);
      if (!franchiseInfo) {
        throw new NotFoundException('Franchise information not found');
      }
      return {
        status: HttpStatus.OK,
        data: franchiseInfo
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Franchise information not found',
      }, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() NavigationUpdateDto: NavigationUpdateDto,
  ) {
    try {
      const result = await this.NavigationMenuService.update(id, NavigationUpdateDto);
      if (!result) {
        throw new NotFoundException('Franchise information not found');
      }
      return {
        status: HttpStatus.OK,
        message: 'Franchise information updated successfully',
        data: result
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error updating franchise information',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const result = await this.NavigationMenuService.remove(id);
      if (!result) {
        throw new NotFoundException('Franchise information not found');
      }
      return {
        status: HttpStatus.OK,
        message: 'Franchise information deleted successfully'
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error deleting franchise information',
      }, HttpStatus.BAD_REQUEST);
    }
  }
}

