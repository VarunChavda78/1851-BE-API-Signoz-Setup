import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilterDto } from './dtos/filter-dto';
import { CommonService } from 'src/shared/services/common.service';
import { Registration } from 'src/mysqldb/entities/registration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from 'src/mysqldb/entities/admin.entity';
import { ConfigService } from '@nestjs/config';
import { Brand } from 'src/mysqldb/entities/brand.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Registration, 'mysqldb')
    private usersRepository: Repository<Registration>,
    @InjectRepository(Admin, 'mysqldb')
    private adminRepository: Repository<Admin>,
    @InjectRepository(Brand, 'mysqldb')
    private brandRepository: Repository<Brand>,
    private commonService: CommonService,
    private configservice: ConfigService,
  ) {}

  async findAll(filterDto?: FilterDto) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        role,
        order,
        sort,
      } = filterDto || {};
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      let query;
      let totalRecords = 0;

      const applySort = (query) => {
        if (sort) {
          switch (sort.toLowerCase()) {
            case 'role':
              query = query.orderBy(
                role === 'admin' || role === 'superadmin'
                  ? 'admin.type'
                  : 'registration.user_type',
                order,
              );
              break;
            case 'date_created':
              query = query.orderBy(
                role === 'admin' || role === 'superadmin'
                  ? 'admin.created_date'
                  : 'registration.created_date',
                order,
              );
              break;
            case 'last_seen':
              query = query.orderBy(
                role === 'admin' || role === 'superadmin'
                  ? 'admin.last_seen'
                  : 'registration.last_seen',
                order,
              );
              break;
            case 'first_name':
              query = query.orderBy(
                role === 'admin' || role === 'superadmin'
                  ? 'admin.first_name'
                  : 'registration.first_name',
                order,
              );
              break;
            case 'last_name':
              query = query.orderBy(
                role === 'admin' || role === 'superadmin'
                  ? 'admin.last_name'
                  : 'registration.last_name',
                order,
              );
              break;
            case 'name':
              query = query
                .orderBy(
                  role === 'admin' || role === 'superadmin'
                    ? 'admin.first_name'
                    : 'registration.first_name',
                  order,
                )
                .addOrderBy(
                  role === 'admin' || role === 'superadmin'
                    ? 'admin.last_name'
                    : 'registration.last_name',
                  order,
                );
              break;
            default:
              query = query.orderBy(
                role === 'admin' || role === 'superadmin'
                  ? 'admin.created_date'
                  : 'registration.created_date',
                'DESC',
              );
          }
        } else {
          query = query.orderBy(
            role === 'admin' || role === 'superadmin'
              ? 'admin.created_date'
              : 'registration.created_date',
            'DESC',
          );
        }
        return query;
      };
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

        let results = [...adminResults, ...userResults];

        results = this.applySorting(results, sort, order);
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
        query = applySort(query);
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
          query = query.andWhere(
            "registration.brand_category_id > 0 OR registration.brand_url != ''",
          );
        } else if (role === 'author' || role === 'user') {
          query = query.andWhere('registration.user_type = :role', { role });
        }
        query = applySort(query);
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

  private applySorting(
    results: any[],
    sort?: string,
    order: 'ASC' | 'DESC' = 'ASC',
  ): any[] {
    if (!sort) {
      // Default sorting by created_date if no sort parameter is provided
      return results.sort((a, b) =>
        order === 'ASC'
          ? new Date(a.created_date).getTime() -
            new Date(b.created_date).getTime()
          : new Date(b.created_date).getTime() -
            new Date(a.created_date).getTime(),
      );
    }

    switch (sort) {
      case 'role':
        return results.sort((a, b) => {
          const roleA = this.getRoleFromUser(a);
          const roleB = this.getRoleFromUser(b);
          return order === 'ASC'
            ? roleA.localeCompare(roleB)
            : roleB.localeCompare(roleA);
        });

      case 'date_created':
        return results.sort((a, b) =>
          order === 'ASC'
            ? new Date(a.created_date).getTime() -
              new Date(b.created_date).getTime()
            : new Date(b.created_date).getTime() -
              new Date(a.created_date).getTime(),
        );

      case 'last_seen':
        return results.sort((a, b) => {
          const dateA = a.last_seen ? new Date(a.last_seen).getTime() : 0;
          const dateB = b.last_seen ? new Date(b.last_seen).getTime() : 0;
          return order === 'ASC' ? dateA - dateB : dateB - dateA;
        });

      case 'first_name':
        return results.sort((a, b) =>
          order === 'ASC'
            ? a.first_name.localeCompare(b.first_name)
            : b.first_name.localeCompare(a.first_name),
        );

      case 'last_name':
        return results.sort((a, b) =>
          order === 'ASC'
            ? a.last_name.localeCompare(b.last_name)
            : b.last_name.localeCompare(a.last_name),
        );

      case 'name':
        return results.sort((a, b) => {
          const fullNameA = `${a.first_name} ${a.last_name}`;
          const fullNameB = `${b.first_name} ${b.last_name}`;
          return order === 'ASC'
            ? fullNameA.localeCompare(fullNameB)
            : fullNameB.localeCompare(fullNameA);
        });

      default:
        // Default to sorting by created_date
        return results.sort((a, b) =>
          order === 'ASC'
            ? new Date(a.created_date).getTime() -
              new Date(b.created_date).getTime()
            : new Date(b.created_date).getTime() -
              new Date(a.created_date).getTime(),
        );
    }
  }

  private getRoleFromUser(user: any) {
    let role;
    if (user?.type) {
      role = user.type;
    } else if (user?.user_type) {
      role =
        user.brand_category_id > 0 || user.brand_url ? 'brand' : user.user_type;
    }

    return role;
  }

  private formatData(data: any) {
    const response = data.map((user) => {
      const role = this.getRoleFromUser(user);
      let photo = `${this.configservice.get('s3.imageUrl')}/`;
      if (role === 'author') {
        photo += `author/${data.photo}`;
      } else if (role === 'brand') {
        photo += `brand/logo/${data.photo}`;
      } else if (role === 'admin' || role === 'superadmin') {
        photo += `admin/${data.photo}`;
      } else {
        photo += `user/${data.photo}`;
      }
      const formattedCreatedDate = user.created_date
        ? dayjs(user.created_date).format('MMMM D, YYYY h:mm A')
        : dayjs().format('MMMM D, YYYY h:mm A');

      const formattedLastSeen = user.last_seen
        ? dayjs(user.last_seen).format('MMMM D, YYYY h:mm A')
        : dayjs().format('MMMM D, YYYY h:mm A');
      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        role,
        date_created: formattedCreatedDate,
        last_seen: formattedLastSeen,
        photo: data.photo ? photo : '',
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
      'registration.gtm',
      'registration.google_ads_account_id',
      'registration.brand_url',
    ];
  }

  async findOne(id: number, role: string) {
    try {
      if (!id || !role) {
        throw new BadRequestException('Please provide id and role');
      }
      if (role === 'admin' || role === 'superadmin') {
        const admin = await this.adminRepository
          .createQueryBuilder('admin')
          .select(this.selectAdminFields())
          .where('admin.id = :id', { id })
          .andWhere('admin.type = :role', { role })
          .getOne();

        if (!admin) {
          throw new NotFoundException('Admin not found');
        }
        const formattedData = await this.formatDetails(admin, role);
        return { data: formattedData };
      } else {
        const userQuery = this.usersRepository
          .createQueryBuilder('registration')
          .select(this.selectUserFields())
          .where('registration.id = :id', { id });

        if (role === 'brand') {
          userQuery.andWhere(
            "registration.brand_category_id > 0 OR registration.brand_url != ''",
          );
        } else if (role === 'author' || role === 'user') {
          userQuery.andWhere('registration.user_type = :role', { role });
        }

        const user = await userQuery.getOne();
        if (!user) {
          throw new NotFoundException('User not found');
        }
        const formattedData = await this.formatDetails(user, role);
        return { data: formattedData };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  private async formatDetails(data: any, role: string) {
    const pageUrl =
      role === 'admin'
        ? '/admin/dashboard'
        : role === 'author'
          ? '/author/content'
          : role === 'brand'
            ? '/brand/profile'
            : '';
    const siteUrl =
      role === 'brand' && data.brand_url
        ? `${data.brand_url}.com/franchise`
        : '';
    const authorTitle = role === 'author' ? `${data.author_title}` : '';
    let photo = `${this.configservice.get('s3.imageUrl')}/`;
    if (role === 'author') {
      photo += `author/${data.photo}`;
    } else if (role === 'brand') {
      photo += `brand/logo/${data.photo}`;
    } else if (role === 'admin' || role === 'superadmin') {
      photo += `admin/${data.photo}`;
    }
    // For user what
    const brands =
      role === 'author' ? await this.getBrandsForAuthor(data.id) : [];
    const response = {
      id: data.id,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      photo,
      role,
      username: data.user_name,
      password: data.password,
      phone: data.phone,
      pageUrl, // verify
      siteUrl, // verify
      authorTitle,
      authorFrom: '', // what
      brands: brands?.length ? brands : [],
      gtm: role === 'brand' ? data.gtm : '',
      adsAccountId: role === 'brand' ? data.google_ads_account_id : '',
    };
    return response;
  }

  private async getBrandsForAuthor(id: number) {
    const brands = await this.brandRepository
      .createQueryBuilder('brand')
      .select(['brand.id', 'brand.title'])
      .where('brand.user_id = :id', { id })
      .getMany();
    return brands;
  }
}
