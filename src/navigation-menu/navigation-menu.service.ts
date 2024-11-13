import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NavigationMenu } from 'src/mysqldb/entities/customize-user-sidebar.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NavigationMenuService{
    constructor(
        @InjectRepository(NavigationMenu, 'mysqldb')
        private navigationmenuRepository: Repository<NavigationMenu>
    ){}
}
