import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { navigationMenu } from '../mysqldb/entities/customize-user-sidebar.entity'

@Injectable()
export class NavigationMenuRepository extends Repository<navigationMenu> {
  constructor(private dataSource: DataSource) {
    super(navigationMenu, dataSource.createEntityManager());
  }
}
