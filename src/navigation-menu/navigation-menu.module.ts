import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavigationMenuService } from './navigation-menu.service';
import { NavigationMenuController } from './navigation-menu.controller';
import { NavigationMenu } from '../mysqldb/entities/customize-user-sidebar.entity'

@Module({
  imports: [TypeOrmModule.forFeature([NavigationMenu],'mysqldb')],
  providers: [NavigationMenuService],
  controllers: [NavigationMenuController],
})
export class NavigationMenuModule {}
