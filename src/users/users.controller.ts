import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FilterDto } from './dtos/filter-dto';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private user: UsersService) {}
  @Get()
  async getUsers(@Query() filterDto: FilterDto) {
    try {
      const response = await this.user.findAll(filterDto);
      return response;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
