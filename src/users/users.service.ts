import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { AdminRepository } from './repositories/admin.repository';
import { FilterDto } from './dtos/filter-dto';
import { CommonService } from 'src/shared/services/common.service';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private adminRepository: AdminRepository,
    private commonService: CommonService,
  ) {}

  async findAll(filterDto?: FilterDto) {
    try {
      const { page = 1, limit = 20, status, role } = filterDto || {};
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      let query;
      let totalRecords = 0;
      if (!role && !status) {
        const adminQuery = this.adminRepository
          .createQueryBuilder('admin')
          .select(this.selectAdminFields());

        const userQuery = this.usersRepository
          .createQueryBuilder('registration')
          .select(this.selectUserFields());

        const [adminResults, userResults] = await Promise.all([
          adminQuery.getMany(),
          userQuery.getMany(),
        ]);

        let results = [...adminResults, ...userResults].sort(
          (a, b) =>
            new Date(b.created_date).getTime() -
            new Date(a.created_date).getTime(),
        );

        totalRecords = results.length;

        results = results.slice(skip, skip + limitNum);

        const formattedData = this.formatData(results);

        const pagination = this.commonService.getPagination(
          totalRecords,
          limitNum,
          pageNum,
        );

        return { data: formattedData, pagination };
      }

      if (role === 'admin' || role === 'superadmin') {
        query = this.adminRepository
          .createQueryBuilder('admin')
          .select(this.selectAdminFields());

        if (role) {
          query = query.andWhere('admin.type = :role', { role });
        }

        totalRecords = await query.getCount();
        const results = await query.skip(skip).take(limit).getMany();
        const formattedData = this.formatData(results);

        const pagination = this.commonService.getPagination(
          totalRecords,
          limitNum,
          pageNum,
        );

        return { data: formattedData, pagination };
      } else {
        query = this.usersRepository
          .createQueryBuilder('registration')
          .select(this.selectUserFields());

        if (status) {
          query = query.andWhere('registration.status = :status', { status });
        }

        if (role === 'brand') {
          query = query.andWhere('registration.brand_category_id > 0');
        } else if (role === 'author' || role === 'user') {
          query = query.andWhere('registration.user_type = :role', { role });
        }
        totalRecords = await query.getCount();
        const results = await query.skip(skip).take(limit).getMany();
        const formattedData = this.formatData(results);

        const pagination = this.commonService.getPagination(
          totalRecords,
          limit,
          page,
        );

        return { data: formattedData, pagination };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private formatData(data: any) {
    const response = data.map((user) => {
      let role;
      if (user?.type) {
        role = user.type;
      } else if (user?.user_type) {
        role = user.brand_category_id > 0 ? 'brand' : user.user_type;
      }
      return {
        id: user.id,
        role,
        date_created: user.created_date,
      };
    });

    return response;
  }

  private selectAdminFields() {
    return [
      'admin.id',
      'admin.first_name',
      'admin.last_name',
      'admin.company',
      'admin.email',
      'admin.phone',
      'admin.user_name',
      'admin.type',
      'admin.registration_date',
      'admin.created_date',
      'admin.photo',
    ];
  }

  private selectUserFields() {
    return [
      'registration.id',
      'registration.first_name',
      'registration.last_name',
      'registration.company',
      'registration.email',
      'registration.phone',
      'registration.user_name',
      'registration.user_type',
      'registration.registration_date',
      'registration.created_date',
      'registration.photo',
      'registration.brand_category_id',
      'registration.status',
    ];
  }
}
