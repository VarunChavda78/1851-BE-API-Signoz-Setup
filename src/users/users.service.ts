import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { AdminRepository } from './repositories/admin.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private adminRepository: AdminRepository,
  ) {}

  async finaAll() {
    try {
      const usersQuery = await this.usersRepository
        .createQueryBuilder()
        .getMany();
      const adminQuery = await this.adminRepository
        .createQueryBuilder()
        .getMany();

      return this.formatData([...usersQuery, ...adminQuery]);
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
}
