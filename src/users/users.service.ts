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
      const { page = 1, limit = 20, status, role } = filterDto;
      const skip = (page - 1) * limit;
      let usersQuery = this.usersRepository
        .createQueryBuilder('registration')
        .select();
      let adminQuery = this.adminRepository
        .createQueryBuilder('admin')
        .select();

      if (status) {
        usersQuery = usersQuery.andWhere('registration.status = :status', {
          status,
        });
      }

      if (role) {
        switch (role) {
          case 'brand':
            usersQuery = usersQuery.andWhere(
              'registration.brand_category_id > 0',
            );
            break;
          case 'author':
          case 'user':
            usersQuery = usersQuery.andWhere('registration.user_type = :role', {
              role,
            });
            break;
          case 'admin':
          case 'superadmin':
            adminQuery = adminQuery.andWhere('admin.type = :role', { role });
            break;
        }
      }
      const totalRecords =
        (await usersQuery.getCount()) + (await adminQuery.getCount());
      const [users, admins] = await Promise.all([
        usersQuery.getMany(),
        adminQuery.getMany(),
      ]);

      let combinedResults = [...users, ...admins];
      combinedResults = combinedResults.slice(skip, skip + limit);
      const formattedData = this.formatData(combinedResults);
      const pagination = this.commonService.getPagination(
        totalRecords,
        page,
        limit,
      );
      return { data: formattedData, pagination };
    } catch (error) {
      throw error;
    }
  }

  private formatData(data: any) {
    const response = data.map((user) => {
      let role;
      if (user?.user_type) {
        role = user.user_type;
      } else if (user?.type) {
        role = user.brand_category_id > 0 ? 'brand' : user.type;
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
      'id',
      'first_name',
      'last_name',
      'company',
      'email',
      'phone',
      'user_name',
      'type',
      'registration_date',
      'created_date',
      'photo',
    ];
  }

  private selectUserFields() {
    return [
      'id',
      'first_name',
      'last_name',
      'company',
      'email',
      'phone',
      'user_name',
      'user_type',
      'registration_date',
      'created_date',
      'photo',
      'brand_category_id',
      'status',
    ];
  }
}
