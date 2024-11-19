import { Injectable ,NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NavigationMenu } from 'src/mysqldb/entities/customize-user-sidebar.entity';
import { Repository } from 'typeorm';
import {NavigationCreateDto,NavigationUpdateDto} from './dtos/navigation-create-dto'


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

      async findOne(id: number): Promise<NavigationMenu> {
        const franchiseInfo = await this.navigationmenuRepository.findOne({ 
          where: { id } 
        });
        if (!franchiseInfo) {
          throw new NotFoundException(`Franchise info with ID ${id} not found`);
        }
        return franchiseInfo;
      }

      async update(id: number, NavigationUpdateDto: NavigationUpdateDto): Promise<NavigationMenu> {
        const franchiseInfo = await this.findOne(id);
        if (!franchiseInfo) {
          throw new NotFoundException(`Franchise info with ID ${id} not found`);
        }
        
        Object.assign(franchiseInfo, NavigationUpdateDto);
        return await this.navigationmenuRepository.save(franchiseInfo);
      }
    
      async remove(id: number): Promise<boolean> {
        const franchiseInfo = await this.findOne(id);
        if (!franchiseInfo) {
          throw new NotFoundException(`Franchise info with ID ${id} not found`);
        }
        
        const result = await this.navigationmenuRepository.delete(id);
        return result.affected > 0;
      }
}
