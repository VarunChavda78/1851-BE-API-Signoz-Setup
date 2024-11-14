import { Controller,Post,Body } from '@nestjs/common';
import {NavigationCreateDto} from './dtos/navigation-create-dto'
import  {NavigationMenuService} from './navigation-menu.service'

@Controller('navigation-menu')
export class NavigationMenuController {
    constructor(private readonly NavigationMenuService: NavigationMenuService) {}

  @Post('create')
  async create(@Body() NavigationCreateDto: NavigationCreateDto) {
    return await this.NavigationMenuService.create(NavigationCreateDto);
  }
}

