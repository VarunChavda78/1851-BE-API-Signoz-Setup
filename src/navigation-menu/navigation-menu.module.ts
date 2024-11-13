import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavigationMenuService } from './navigation-menu.service';
import { NavigationMenuController } from './navigation-menu.controller';
import { navigationMenu } from '../mysqldb/entities/customize-user-sidebar.entity'

@Module({
  imports: [TypeOrmModule.forFeature([navigationMenu])],
  providers: [NavigationMenuService],
  controllers: [NavigationMenuController],
})
export class NavigationMenuModule {}
