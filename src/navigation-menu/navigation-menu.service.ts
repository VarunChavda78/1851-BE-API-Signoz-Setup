import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NavigationMenu } from 'src/mysqldb/entities/customize-user-sidebar.entity';
import { Repository } from 'typeorm';
import {NavigationCreateDto} from './dtos/navigation-create-dto'


@Injectable()
export class NavigationMenuService{
    constructor(
        @InjectRepository(NavigationMenu, 'mysqldb')
        private navigationmenuRepository: Repository<NavigationMenu>
    ){}

    async create(NavigationCreateDto: NavigationCreateDto): Promise<NavigationMenu> {
        const franchiseInfo = this.navigationmenuRepository.create(NavigationCreateDto);
        return await this.navigationmenuRepository.save(franchiseInfo);
      }
}
