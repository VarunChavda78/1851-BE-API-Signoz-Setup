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
      // async getNavigationMenus(
      //   search?: string,
      //   sortBy?: string,
      //   order: 'ASC' | 'DESC' = 'ASC',
      //   page: number = 1,
      //   limit: number = 10,
      // ) {
      //   const queryBuilder = this.navigationmenuRepository.createQueryBuilder('menu');
    
      //   // Apply search filter (search by title fields)
      //   if (search) {
      //     queryBuilder.andWhere(
      //       '(menu.linkTitle1 LIKE :search OR menu.linkTitle2 LIKE :search OR menu.linkTitle3 LIKE :search OR ' +
      //       'menu.linkTitle4 LIKE :search OR menu.linkTitle5 LIKE :search OR menu.linkTitle6 LIKE :search OR ' +
      //       'menu.linkTitle7 LIKE :search OR menu.linkTitle8 LIKE :search OR menu.linkTitle9 LIKE :search OR ' +
      //       'menu.linkTitle10 LIKE :search OR menu.linkTitle11 LIKE :search OR menu.linkTitle12 LIKE :search)',
      //       { search: `%${search}%` }
      //     );
      //   }
    
    
      //     // Get data ordered by createdDate by default
      //     queryBuilder.orderBy('menu.createdDate', 'DESC');
      //     const data = await queryBuilder.getMany();
    
      //    // Map the data to the required format
      //    let transformedData = data.flatMap(menu => {
      //     const links = [
      //       { title: menu.linkTitle1, url: menu.linkUrl1 },
      //       { title: menu.linkTitle2, url: menu.linkUrl2 },
      //       { title: menu.linkTitle3, url: menu.linkUrl3 },
      //       { title: menu.linkTitle4, url: menu.linkUrl4 },
      //       { title: menu.linkTitle5, url: menu.linkUrl5 },
      //       { title: menu.linkTitle6, url: menu.linkUrl6 },
      //       { title: menu.linkTitle7, url: menu.linkUrl7 },
      //       { title: menu.linkTitle8, url: menu.linkUrl8 },
      //       { title: menu.linkTitle9, url: menu.linkUrl9 },
      //       { title: menu.linkTitle10, url: menu.linkUrl10 },
      //       { title: menu.linkTitle11, url: menu.linkUrl11 },
      //       { title: menu.linkTitle12, url: menu.linkUrl12 }
      //     ];
      //     // Include only the non-null links
      //     return links
      //     .filter(link => 
      //       link.title && 
      //       link.url && 
      //       (!search || link.title.toLowerCase().includes(search.toLowerCase()))
      //     )
      //     .map((link) => ({
      //       id: menu.id,
      //       title: link.title,
      //       url: link.url,
      //     }));
      //   });
    
      //   if (sortBy === 'title') {
      //     transformedData.sort((a, b) => {
      //       if (order === 'ASC') {
      //         return a.title.localeCompare(b.title);
      //       } else {
      //         return b.title.localeCompare(a.title);
      //       }
      //     });
      //   } else if (sortBy === 'title_url') {
      //     transformedData.sort((a, b) => {
      //       if (order === 'ASC') {
      //         return a.url.localeCompare(b.url);
      //       } else {
      //         return b.url.localeCompare(a.url);
      //       }
      //     });
      //   }
    
      //   // Apply pagination after sorting
      //   const totalRecords = transformedData.length;
      //   const startIndex = (page - 1) * limit;
      //   const endIndex = startIndex + limit;
      //   transformedData = transformedData.slice(startIndex, endIndex);
    
      //   const pagination = this.commonService.getPagination(totalRecords, limit, page);
    
      //   return { transformedData, pagination };
      // }
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
          queryBuilder.andWhere('menu.section_title LIKE :search', { search: `%${search}%` });
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
