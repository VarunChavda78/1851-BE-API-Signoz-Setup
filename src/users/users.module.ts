import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registration } from '../mysqldb/entities/registration.entity';
import { UsersRepository } from './repositories/users.repository';
import { AdminRepository } from './repositories/admin.repository';
import { Admin } from 'src/mysqldb/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Registration, Admin])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AdminRepository],
})
export class UsersModule {}
