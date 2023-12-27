import { Injectable, NotFoundException } from '@nestjs/common';
import { InfoFilter } from '../dtos/supplierInfoDto';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { SupplierInfoRepository } from '../repositories/supplier-info.repository';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { ConfigService } from '@nestjs/config';
import { LayoutService } from 'src/layout/services/layout.service';

@Injectable()
export class SupplierInfoService {
  constructor(
    private supplierRepo: SupplierRepository,
    private repository: SupplierInfoRepository,
    private mediaRepo: MediaRepository,
    private readonly config: ConfigService,
    private layoutService: LayoutService,
  ) {}

  async getInfo(infoFilter: InfoFilter) {
    const { slug } = infoFilter;
    const supplier = await this.supplierRepo.findOne({ where: { slug } });
    if (!supplier) {
      throw new NotFoundException();
    } else {
      let data = {};
      const info = await this.repository.findOne({
        where: { supplier_id: supplier?.id },
      });
      if (info) {
        const atsMedia = await this.mediaRepo.findOne({
          where: { id: info?.ats_media_id },
        });
        atsMedia['image'] =
          atsMedia?.type === 'video'
            ? atsMedia?.image
            : `${this.config.get(
                's3.imageUrl',
              )}/supplier-db/supplier/${atsMedia?.image}`;
        const serviceMedia = await this.mediaRepo.findOne({
          where: { id: info?.service_media_id },
        });
        serviceMedia['image'] =
          serviceMedia?.type === 'video'
            ? serviceMedia?.image
            : `${this.config.get(
                's3.imageUrl',
              )}/supplier-db/supplier/${serviceMedia?.image}`;
        let media = {};
        if (supplier?.mts_video) {
          const thumbnailImage = supplier?.mts_video
            ? await this.layoutService.getThumbnailUrl(supplier?.mts_video)
            : null;
          media = {
            type: 'video',
            image: thumbnailImage,
            url: supplier?.mts_video,
          };
        }
        data = {
          id: info?.id,
          name: supplier?.name,
          slug: supplier?.slug,
          rating: supplier?.rating,
          website: info?.website,
          logo: supplier?.logo
            ? `${this.config.get(
                's3.imageUrl',
              )}/supplier-db/supplier/${supplier?.logo}`
            : `${this.config.get(
                's3.imageUrl',
              )}/supplier-db/supplier/client-logo.png`,
          media,
          about_the_supplier: {
            content: info?.ats_content,
            media: atsMedia ?? null,
          },
          services: {
            content: info?.service_content,
            media: serviceMedia ?? null,
          },
        };
      }
      return data;
    }
  }
}
