import { Module } from '@nestjs/common';
import { MysqldbService } from './mysqldb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { BrandCategory } from './entities/brand-category.entity';
import { BrandFranchise } from './entities/brand-franchise.entity';
import { Brand } from './entities/brand.entity';
import { NavigationMenu } from './entities/customize-user-sidebar.entity';
import { Registration } from './entities/registration.entity';
import { LocationService } from './location.service';
import { MysqlGALocationMetrics } from './entities/mysql-ga-location-metrics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Admin,
        BrandCategory,
        BrandFranchise,
        Brand,
        NavigationMenu,
        Registration,
        MysqlGALocationMetrics,
      ],
      'mysqldb',
    ),
  ],
  providers: [MysqldbService, LocationService],
  exports: [TypeOrmModule, MysqldbService, LocationService],
})
export class MysqldbModule {}
