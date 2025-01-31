import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { Brand } from './entities/brand.entity';

@Injectable()
export class MysqldbService {
  constructor(
    @InjectRepository(Admin, 'mysqldb')
    private adminRepository: Repository<Admin>,
    @InjectRepository(Registration, 'mysqldb')
    private registrationRepo: Repository<Registration>,
    @InjectRepository(Brand, 'mysqldb')
    private repo: Repository<Brand>,
  ) {}
  async fetchUserByToken(token: string | null, id: any | null) {
    try {
      const query = this.adminRepository
        .createQueryBuilder('admin')
        .where('admin.access_token = :token', { token });

      const data = await query.getOne();
      return data;
    } catch (err) {
      console.log('err', err);
      return null;
    }
  }

  async fetch1851BrandByToken(token: string | null) {
    try {
      const query = this.registrationRepo
        .createQueryBuilder('registration')
        .where('registration.user_type = :type', { type: 'user' })
        .andWhere('registration.access_token = :token', { token });
      const data = await query.getOne();
      return data;
    } catch (err) {
      console.log('err', err);
      return null;
    }
  }

  async fetchBrandByToken(token: string) {
    try {
      const data = await this.repo
        .createQueryBuilder('brands')
        .where('brands.accessToken = :token', { token })
        .getOne();
      return data;
    } catch (err) {
      console.log('err', err);
      return null;
    }
  }

  async fetchUserByGipId(id: string | null) {
    try {
      const query = this.adminRepository
        .createQueryBuilder('admin')
        .where('admin.gipId = :id', { id });

      const data = await query.getOne();
      return data;
    } catch (err) {
      console.log('err', err);
      return null;
    }
  }
}
