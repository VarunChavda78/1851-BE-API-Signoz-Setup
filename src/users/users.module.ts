import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registration } from '../mysqldb/entities/registration.entity';
import { Admin } from '../mysqldb/entities/admin.entity';
import { CommonService } from 'src/shared/services/common.service';

@Module({
  imports: [TypeOrmModule.forFeature([Registration, Admin], 'mysqldb')],
  controllers: [UsersController],
  providers: [UsersService, CommonService],
})
export class UsersModule {}
