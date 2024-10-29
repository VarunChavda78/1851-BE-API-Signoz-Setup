import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FilterDto } from './dtos/filter-dto';
import { UpdateUserDto } from './dtos/edit-dto';

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

  @Post(':id')
  async updateUser(
    @Param('id') id: number,
    @Body('role') role: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const response = await this.user.updateUser(id, role, updateUserDto);
      return response;
    } catch (error) {
      throw new HttpException(
        'Failed to update user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
