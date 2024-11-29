import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NavigationMenu } from 'src/mysqldb/entities/customize-user-sidebar.entity';
import { Repository } from 'typeorm';
import {
  NavigationCreateDto,
  NavigationUpdateDto,
} from './dtos/navigation-create-dto';
import { CommonService } from '../shared/services/common.service';
import { ConfigService } from '@nestjs/config';
import { RollbarLogger } from 'nestjs-rollbar';

@Injectable()
export class NavigationMenuService {
  private logger = new Logger('NavigationMenuService');
  constructor(
    @InjectRepository(NavigationMenu, 'mysqldb')
    private navigationmenuRepository: Repository<NavigationMenu>,
    private commonService: CommonService,
    private configService: ConfigService,
    private rollbarLogger: RollbarLogger,
  ) {}

  async create(
    NavigationCreateDto: NavigationCreateDto,
  ): Promise<NavigationMenu> {
   try {
     const franchiseInfo =
       this.navigationmenuRepository.create(NavigationCreateDto);
     return await this.navigationmenuRepository.save(franchiseInfo);
   } catch (error) {
    this.logger.error('Error creating navigation menu', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.create.name} - ${error.message}`,
        error,
      );
    throw error;
   }
  }

  async findOne(id: number): Promise<NavigationMenu> {
    try {
      const franchiseInfo = await this.navigationmenuRepository.findOne({
        where: { id },
      });
  
      if (!franchiseInfo) {
        throw new NotFoundException(`Franchise info with ID ${id} not found`);
      }
      const baseImageUrl = `${this.configService.get(
        's3.imageUrl',
      )}/home-navigation-menu/`;
  
      const keys = Object.keys(franchiseInfo);
  
      keys
        .filter((key) => key.startsWith('linkImage'))
        .forEach((key) => {
          if (franchiseInfo[key] && typeof franchiseInfo[key] === 'string') {
            franchiseInfo[key] = `${baseImageUrl}${franchiseInfo[key]}`;
          }
        });
  
      return franchiseInfo;
    } catch (error) {
      this.logger.error('Error fetching navigation menu details', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.findOne.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async update(
    id: number,
    NavigationUpdateDto: NavigationUpdateDto,
  ): Promise<NavigationMenu> {
    try {
      const franchiseInfo = await this.findOne(id);
      if (!franchiseInfo) {
        throw new NotFoundException(`Franchise info with ID ${id} not found`);
      }
  
      Object.assign(franchiseInfo, NavigationUpdateDto);
      return await this.navigationmenuRepository.save(franchiseInfo);
    } catch (error) {
      this.logger.error('Error updating navigation menu item', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.update.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const franchiseInfo = await this.findOne(id);
      if (!franchiseInfo) {
        throw new NotFoundException(`Franchise info with ID ${id} not found`);
      }
  
      const result = await this.navigationmenuRepository.delete(id);
      return result.affected > 0;
    } catch (error) {
      this.logger.error('Error removing navigation menu item', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.remove.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }
  async getNavigationMenus(
    search?: string,
    sortBy: string = 'section_title',
    order: 'ASC' | 'DESC' = 'ASC',
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const queryBuilder =
        this.navigationmenuRepository.createQueryBuilder('menu');
  
      // Apply search filter (search by section_title)
      if (search) {
        queryBuilder.andWhere('LOWER(menu.section_title) LIKE LOWER(:search)', {
          search: `%${search}%`,
        });
      }
      // Apply sorting (default sorting by section_title)
      if (sortBy === 'section_title') {
        queryBuilder.orderBy(`menu.${sortBy}`, order);
      }
  
      // Execute query
      const totalRecords = await queryBuilder.getCount();
  
      queryBuilder.skip((page - 1) * limit).take(limit);
  
      const data = await queryBuilder.getMany();
  
      // Prepare pagination response
      const pagination = this.commonService.getPagination(
        totalRecords,
        limit,
        page,
      );
  
      const transformedData = data.map((menu) => ({
        id: menu.id,
        title: menu.section_title,
      }));
  
      return { data: transformedData, pagination };
    } catch (error) {
      this.logger.error('Error fetching navigation menus', error);
      this.rollbarLogger.error(
        `${this.constructor.name}.${this.getNavigationMenus.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }
}
