import { BadRequestException, Injectable } from '@nestjs/common';
import { FilterDto } from './dtos/filter-dto';
import { CommonService } from 'src/shared/services/common.service';
import { Registration } from 'src/mysqldb/entities/registration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from 'src/mysqldb/entities/admin.entity';
import { ConfigService } from '@nestjs/config';
import { Brand } from 'src/mysqldb/entities/brand.entity';
import * as dayjs from 'dayjs';
import { UpdateUserDto } from './dtos/edit-dto';
import { BrandCreateDto, BrandUpdateDto } from './dtos/brand-create-dto';
import { BrandFranchise } from 'src/mysqldb/entities/brand-franchise.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Registration, 'mysqldb')
    private usersRepository: Repository<Registration>,
    @InjectRepository(Admin, 'mysqldb')
    private adminRepository: Repository<Admin>,
    @InjectRepository(Brand, 'mysqldb')
    private brandRepository: Repository<Brand>,
    @InjectRepository(BrandFranchise, 'mysqldb')
    private brandFranchiseRepository: Repository<BrandFranchise>,
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
        sort = 'date_created',
      } = filterDto || {};
      let { order = 'DESC' } = filterDto || {};
      order = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

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

        let results = [...adminResults, ...userResults];

        totalRecords = results.length;
        results = this.applySorting(results, sort, order);
        results = results.slice(skip, skip + limitNum);

        const formattedData = await this.formatData(results);

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
        query = applySort(query);
        const results = await query.skip(skip).take(limitNum).getMany();

        const formattedData = await this.formatData(results);

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
          query = query.andWhere('registration.user_type = :user_type', {
            user_type: 'user',
          });
        } else if (role === 'author') {
          query = query.andWhere('registration.user_type = :role', { role });
        }
        totalRecords = await query.getCount();
        query = applySort(query);
        const results = await query.skip(skip).take(limitNum).getMany();

        const formattedData = await this.formatData(results);

        const pagination = this.commonService.getPagination(
          totalRecords,
          limitNum,
          pageNum,
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
      role = user.user_type === 'user' ? 'brand' : user.user_type;
    }

    return role;
  }

  private async formatData(data: any) {
    const promises = data.map(async (user) => {
      const role = this.getRoleFromUser(user);
      let pageUrl = '';
      if (role === 'admin') {
        pageUrl = '/admin/dashboard';
      } else if (role === 'author') {
        pageUrl = '/author/content';
      } else if (role === 'brand' && user.brand_url) {
        pageUrl = `${user.brand_url}/info`;
      }
      const siteUrl =
        role === 'brand' && user.franchise_link ? user.franchise_link : '';
      const authorTitle = role === 'author' ? `${user.author_title}` : '';
      let photo = `${this.configservice.get('s3.imageUrl')}/`;
      if (role === 'author' || role === 'admin' || role === 'superadmin') {
        photo += `${role}/${user.photo}`;
      } else if (role === 'brand') {
        photo += `brand/logo/${user.photo}`;
      }
      const formattedCreatedDate = user.created_date
        ? dayjs(user.created_date).format('MMMM D, YYYY h:mm A')
        : dayjs().format('MMMM D, YYYY h:mm A');

      const formattedLastSeen = user.last_seen
        ? dayjs(user.last_seen).format('MMMM D, YYYY h:mm A')
        : dayjs().format('MMMM D, YYYY h:mm A');
      const brands =
        role === 'author' ? await this.getBrandsForAuthor(user.id) : [];
      const name =
        role === 'brand' && !user.first_name
          ? user.company
          : `${user.first_name} ${user.last_name}`;
      return {
        id: user.id,
        name,
        email: user.email,
        username: user.user_name,
        password: user.password,
        role,
        date_created: formattedCreatedDate,
        last_seen: formattedLastSeen,
        photo: user.photo ? photo : '',
        phone: user.phone,
        pageUrl,
        siteUrl,
        authorTitle,
        authorFrom: '',
        brands: brands?.length ? brands : [],
        gtm: role === 'brand' ? user.gtm : '',
        adsAccountId: role === 'brand' ? user.google_ads_account_id : '',
      };
    });

    return Promise.all(promises);
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
      'registration.author_title',
      'registration.franchise_link',
    ];
  }

  private async getBrandsForAuthor(id: number) {
    const brands = await this.brandRepository
      .createQueryBuilder('brand')
      .select(['brand.id', 'brand.title'])
      .where('brand.user_id = :id', { id })
      .getMany();
    return brands;
  }

  async updateUser(id: number, role, updateUserDto: UpdateUserDto) {
    try {
      if (!id || !role) {
        throw new BadRequestException('Invalid request');
      }
      const {
        name,
        username,
        email,
        phone,
        pageUrl,
        authorFrom,
        authorTitle,
        siteUrl,
        gtm,
        adsAccountId,
        photo,
      } = updateUserDto;
      let first_name, last_name;
      if (name) {
        [first_name, last_name] = updateUserDto.name.split(' ');
      }
      if (role === 'admin' || role === 'superadmin') {
        await this.adminRepository.update(id, {
          first_name,
          last_name,
          user_name: username,
          email,
          phone,
          photo,
        });
        return {
          message: 'User updated successfully',
        };
      } else if (role === 'author') {
        await this.usersRepository.update(id, {
          first_name,
          last_name,
          email,
          phone,
          author_title: authorTitle,
          updated_at: new Date(),
          photo,
        });
        return {
          message: 'User updated successfully',
        };
      } else if (role === 'brand') {
        const user = await this.usersRepository.findOneBy({ id });
        if (user && user.first_name) {
          await this.usersRepository.update(id, {
            first_name,
            last_name,
            email,
            phone,
            brand_url: pageUrl?.split('/')[0],
            franchise_link: siteUrl,
            gtm,
            google_ads_account_id: adsAccountId,
            updated_at: new Date(),
            photo,
          });
          return {
            message: 'User updated successfully',
          };
        } else {
          await this.usersRepository.update(id, {
            company: name,
            email,
            phone,
            brand_url: pageUrl?.split('/')[0],
            franchise_link: siteUrl,
            gtm,
            google_ads_account_id: adsAccountId,
            updated_at: new Date(),
            photo,
          });
          return {
            message: 'User updated successfully',
          };
        }
      } else {
        throw new BadRequestException('Invalid request');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createBrand(payload: BrandCreateDto) {
    try {
      const {
        company,
        brand_url,
        user_name,
        email,
        phone,
        facebook_page,
        franchise_link,
        photo,
        analytics_domain,
        brand_category_id,
        franchise_connection_email,
        story_approval_email,
        story_approve_text,
        type,
      } = payload;
      const response = await this.usersRepository.save({
        company,
        email,
        brand_url,
        user_name,
        phone,
        facebook_page,
        franchise_link,
        franConnectEmail: franchise_connection_email,
        brand_category_id,
        user_type: 'user',
        created_date: new Date(),
        registration_date: new Date(),
        brandLogo: photo,
        created_at: new Date(),
        type,
        story_approval_email,
      });

      if (analytics_domain?.length) {
        await Promise.all(
          analytics_domain.map(async (url) => {
            await this.brandFranchiseRepository.save({
              brand_id: response.id,
              url,
              created_at: new Date(),
              updated_at: new Date(),
            });
          })
        );

        if (response) {
          return {
            message: 'Brand created successfully',
            brandId: response.id,
          };
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateBrand(id: number, payload: BrandUpdateDto) {
    try {
      const {
        company,
        email,
        brand_url,
        user_name,
        phone,
        facebook_page,
        franchise_link,
        photo,
        brand_category_id,
        type,
        story_approval_email,
        analytics_domain,
        franchise_connection_email,
        story_approve_text,
      } = payload;
      await this.usersRepository.update(id, {
        company,
        email,
        brand_url,
        user_name,
        phone,
        facebook_page,
        franchise_link,
        brand_category_id,
        brandLogo: photo,
        type,
        story_approval_email,
        franConnectEmail: franchise_connection_email,
        updated_at: new Date(),
      });
      if(analytics_domain){
        await Promise.all(
          analytics_domain.map(async (url) => {
            await this.brandFranchiseRepository.update(
              { brand_id: id },
              { url }
            );
          })
        );
      }
      return {
        message: 'Brand updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
