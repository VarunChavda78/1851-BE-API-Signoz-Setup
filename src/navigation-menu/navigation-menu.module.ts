import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavigationMenuService } from './navigation-menu.service';
import { NavigationMenuController } from './navigation-menu.controller';
import { NavigationMenu } from '../mysqldb/entities/customize-user-sidebar.entity'
import { CommonService } from 'src/shared/services/common.service';

@Module({
  imports: [TypeOrmModule.forFeature([NavigationMenu],'mysqldb')],
  providers: [NavigationMenuService,CommonService],
  controllers: [NavigationMenuController],
})
export class NavigationMenuModule {}
