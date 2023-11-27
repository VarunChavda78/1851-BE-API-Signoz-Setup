import { Injectable, NotFoundException } from '@nestjs/common';
import { HighlightDto } from '../dtos/highlightDto';
import { HighlightRepository } from '../repositories/highlight.repository';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { SupplierInfoRepository } from 'src/supplier_info/repositories/supplier_info.repository';
import { ConfigService } from '@nestjs/config';

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
    const supplier = await this.supplierRepo.findOne({ where: { slug } });
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
            )}/supplier-db/supplier/${highlight?.logo}`,
            title: highlight?.title,
            content: highlight?.content,
          });
        }
      }
      const info = await this.infoRepo.findOne({
        where: { supplier_id: supplier?.id },
      });
      return { title: info?.highlight_title, data };
    }
  }
}
