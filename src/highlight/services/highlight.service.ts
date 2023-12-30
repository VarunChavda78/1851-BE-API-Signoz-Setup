import { Injectable, NotFoundException } from '@nestjs/common';
import { HighlightDto } from '../dtos/highlightDto';
import { HighlightRepository } from '../repositories/highlight.repository';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { SupplierInfoRepository } from 'src/supplier-info/repositories/supplier-info.repository';
import { ConfigService } from '@nestjs/config';
import { UserStatus } from 'src/user/dtos/UserDto';

@Injectable()
export class HighlightService {
  constructor(
    private repository: HighlightRepository,
    private supplierRepo: SupplierRepository,
    private infoRepo: SupplierInfoRepository,
    private config: ConfigService,
  ) {}

  async getHighlightList(filter: HighlightDto) {
    const { slug } = filter;
    const supplier = await this.supplierRepo
      .createQueryBuilder('suppliers')
      .leftJoinAndSelect('suppliers.user_id', 'user_id')
      .where('suppliers.slug = :slug', { slug })
      .andWhere('user_id.status = :status', { status: UserStatus.APPROVED })
      .getOne();
    if (!supplier) {
      throw new NotFoundException();
    } else {
      const data = [];
      const highlights = await this.repository.find({
        where: { supplier_id: supplier?.id },
      });
      if (highlights.length) {
        for (const highlight of highlights) {
          data.push({
            id: highlight?.id,
            logo: `${this.config.get(
              's3.imageUrl',
            )}/supplier-db/supplier/highlight.svg`,
            title: `Verified Profiles`,
            content: highlight?.content,
          });
        }
      }
      return { title: 'Supplier Highlights', data };
    }
  }
}
