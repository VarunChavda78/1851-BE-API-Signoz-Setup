import { Injectable, NotFoundException } from '@nestjs/common';
import { InfoFilter } from '../dtos/supplierInfoDto';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { SupplierInfoRepository } from '../repositories/supplier-info.repository';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { ConfigService } from '@nestjs/config';
import { MediaTypes } from 'src/media/dtos/mediaDto';
import { UserStatus } from 'src/user/dtos/UserDto';

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
        const atsMedia = info?.ats_media_id
          ? await this.mediaRepo.findOne({
              where: { id: info?.ats_media_id },
            })
          : null;
        const atsMediaContent = atsMedia
          ? {
              id: atsMedia?.id,
              image:
                atsMedia?.type === MediaTypes.TYPE_VIDEO
                  ? atsMedia?.image
                  : `${this.config.get(
                      's3.imageUrl',
                    )}/supplier-db/supplier/${supplier?.id}/${atsMedia?.image}`,
              url: atsMedia?.url ?? '',
              type:
                atsMedia?.type === MediaTypes.TYPE_VIDEO ? 'video' : 'image',
            }
          : {};
        const serviceMedia = info?.service_media_id
          ? await this.mediaRepo.findOne({
              where: { id: info?.service_media_id },
            })
          : null;
        const serviceMediaContent = serviceMedia
          ? {
              id: serviceMedia?.id,
              image:
                serviceMedia?.type === MediaTypes.TYPE_VIDEO
                  ? serviceMedia?.image
                  : `${this.config.get(
                      's3.imageUrl',
                    )}/supplier-db/supplier/${supplier?.id}/${serviceMedia?.image}`,
              url: serviceMedia?.url ?? '',
              type:
                serviceMedia?.type === MediaTypes.TYPE_VIDEO
                  ? 'video'
                  : 'image',
            }
          : null;
        let media = {};
        if (supplier?.mts_video) {
          const thumbnailImage = supplier?.mts_video
            ? await this.getThumbnailUrl(supplier?.mts_video)
            : null;
          media = {
            type: 'video',
            image: thumbnailImage,
            url: supplier?.mts_video,
          };
        }
        let banner_media = {};
        if (info?.banner_media_id) {
          const bannereMedia = await this.mediaRepo.findOne({
            where: { id: info?.banner_media_id },
          });
          banner_media = {
            type: 'image',
            image:
              bannereMedia?.type === MediaTypes.TYPE_IMAGE
                ? `${this.config.get(
                    's3.imageUrl',
                  )}/supplier-db/supplier/${supplier?.id}/${bannereMedia?.image}`
                : '',
            url: bannereMedia?.url ?? '',
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
              )}/supplier-db/supplier/${supplier?.id}/${supplier?.logo}`
            : `${this.config.get(
                's3.imageUrl',
              )}/supplier-db/supplier/client-logo.png`,
          media,
          banner_media,
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

  async getThumbnailUrl(url) {
    const vimeo = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
    const youtube =
      /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
    let thumbnail = null;
    if (youtube.test(url)) {
      thumbnail = await this.getYoutubeThumbnail(url);
    } else if (vimeo.test(url)) {
      thumbnail = await this.getVimeoThumbnail(url);
    }
    return thumbnail;
  }

  async getYoutubeThumbnail(videoUrl: string): Promise<string> {
    // Extract video ID from the YouTube URL
    const videoId = videoUrl.split('v=')[1];

    // Construct the YouTube thumbnail URL
    const thumbnailUrl = `${this.config.get(
      'youtube.baseUrl',
    )}/${videoId}/maxresdefault.jpg`;

    return thumbnailUrl;
  }

  async getVimeoThumbnail(videoUrl: string): Promise<string> {
    // Extract video ID from the Vimeo URL
    const videoId = videoUrl.split('/').pop();

    // Construct the Vimeo thumbnail URL (publicly accessible)
    const thumbnailUrl = `${this.config.get(
      'vimeo.baseUrl',
    )}/${videoId}_1280.jpg`;

    return thumbnailUrl;
  }
}
