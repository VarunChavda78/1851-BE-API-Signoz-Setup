import { Injectable, NotFoundException } from '@nestjs/common';
import { InfoFilter } from '../dtos/supplierInfoDto';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { SupplierInfoRepository } from '../repositories/supplier-info.repository';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { ConfigService } from '@nestjs/config';
import { LayoutService } from 'src/layout/services/layout.service';
import { MediaTypes } from 'src/media/dtos/mediaDto';
import { UserStatus } from 'src/user/dtos/UserDto';

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
    const supplier = await this.supplierRepo
      .createQueryBuilder('suppliers')
      .leftJoinAndSelect('suppliers.user_id', 'user_id')
      .where('suppliers.slug = :slug', { slug })
      .andWhere('user_id.status = :status', { status: UserStatus.APPROVED })
      .getOne();
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
        const atsMediaContent = {
          id: atsMedia?.id,
          image:
            atsMedia?.type === MediaTypes.TYPE_VIDEO
              ? atsMedia?.image
              : `${this.config.get(
                  's3.imageUrl',
                )}/supplier-db/supplier/${atsMedia?.image}`,
          url: atsMedia?.url ?? '',
          type: atsMedia?.type === MediaTypes.TYPE_VIDEO ? 'video' : 'image',
        };
        const serviceMedia = await this.mediaRepo.findOne({
          where: { id: info?.service_media_id },
        });
        const serviceMediaContent = {
          id: serviceMedia?.id,
          image:
            serviceMedia?.type === MediaTypes.TYPE_VIDEO
              ? serviceMedia?.image
              : `${this.config.get(
                  's3.imageUrl',
                )}/supplier-db/supplier/${serviceMedia?.image}`,
          url: serviceMedia?.url ?? '',
          type:
            serviceMedia?.type === MediaTypes.TYPE_VIDEO ? 'video' : 'image',
        };
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
            media: atsMediaContent ?? null,
          },
          services: {
            content: info?.service_content,
            media: serviceMediaContent ?? null,
          },
        };
      }
      return data;
    }
  }
}
