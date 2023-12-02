import { Injectable, NotFoundException } from '@nestjs/common';
import { InfoFilter } from '../dtos/supplierInfoDto';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { SupplierInfoRepository } from '../repositories/supplier-info.repository';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupplierInfoService {
  constructor(
    private supplierRepo: SupplierRepository,
    private repository: SupplierInfoRepository,
    private mediaRepo: MediaRepository,
    private readonly config: ConfigService,
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
        const mtsMedia = await this.mediaRepo.findOne({
          where: { id: info?.mts_media_id },
        });
        mtsMedia['image'] =
          mtsMedia?.type === 'video'
            ? mtsMedia?.image
            : `${this.config.get(
                's3.imageUrl',
              )}/supplier-db/supplier/${mtsMedia?.image}`;
        const differenceMedia = await this.mediaRepo.findOne({
          where: { id: info?.difference_media_id },
        });
        differenceMedia['image'] =
          differenceMedia?.type === 'video'
            ? differenceMedia?.image
            : `${this.config.get(
                's3.imageUrl',
              )}/supplier-db/supplier/${differenceMedia?.image}`;
        let media = {};
        if (supplier?.video_url) {
          const videoId = supplier?.video_url
            ? supplier?.video_url.split('v=')[1]
            : null;
          media = {
            type: 'video',
            image: `${this.config.get(
              'youtube.baseUrl',
            )}/${videoId}/maxresdefault.jpg`,
            url: supplier?.video_url,
          };
        }
        data = {
          id: info?.id,
          name: supplier?.name,
          logo: supplier?.logo
            ? `${this.config.get(
                's3.imageUrl',
              )}/supplier-db/supplier/${supplier?.logo}`
            : `${this.config.get(
                's3.imageUrl',
              )}/supplier-db/supplier/client-logo.png`,
          media,
          meet_the_supplier: {
            content: info?.mts_content,
            media: mtsMedia ?? null,
          },
          difference: {
            content: info?.difference_content,
            media: differenceMedia ?? null,
          },
          services: info?.services,
        };
      }
      return data;
    }
  }
}
