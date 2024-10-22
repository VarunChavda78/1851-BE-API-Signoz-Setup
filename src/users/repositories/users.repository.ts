import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Registration } from '../../mysqldb/entities/registration.entity';

@Injectable()
export class UsersRepository extends Repository<Registration> {
  constructor(private dataSource: DataSource) {
    super(Registration, dataSource.createEntityManager());
  }
}
