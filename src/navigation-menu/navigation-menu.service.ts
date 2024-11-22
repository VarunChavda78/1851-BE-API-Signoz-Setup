import { Injectable ,NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NavigationMenu } from 'src/mysqldb/entities/customize-user-sidebar.entity';
import { Repository } from 'typeorm';
import {NavigationCreateDto,NavigationUpdateDto} from './dtos/navigation-create-dto'
import { CommonService } from '../shared/services/common.service';



@Injectable()
export class NavigationMenuService{
    constructor(
        @InjectRepository(NavigationMenu, 'mysqldb')
        private navigationmenuRepository: Repository<NavigationMenu>,
        private commonService: CommonService,
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
      async getNavigationMenus(
        search?: string,
        sortBy: string = 'section_title',
        order: 'ASC' | 'DESC' = 'ASC',
        page: number = 1,
        limit: number = 10,
      ) {
        const queryBuilder = this.navigationmenuRepository.createQueryBuilder('menu');
      
        // Apply search filter (search by section_title)
        if (search) {
          queryBuilder.andWhere('LOWER(menu.section_title) LIKE LOWER(:search)',
             { search: `%${search.toLowerCase()}%` });
        }
        // Apply sorting (default sorting by section_title)
        if (sortBy === 'section_title') {
          queryBuilder.orderBy(`menu.${sortBy}`, order);
        } 
      
        // Execute query
        const totalRecords = await queryBuilder.getCount()

        queryBuilder.skip((page - 1) * limit).take(limit);
      
        const data = await queryBuilder.getMany();
      
        // Prepare pagination response
        const pagination = this.commonService.getPagination(totalRecords, limit, page);
        
        const transformedData = data.map((menu) => ({
          id: menu.id,
          title: menu.section_title,
        }));

        return { transformedData, pagination };
      }
}
