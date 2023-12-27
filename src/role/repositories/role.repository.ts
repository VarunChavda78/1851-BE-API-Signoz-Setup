import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Role> {
    const role = await this.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }
}
