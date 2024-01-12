import { Injectable, NotFoundException } from '@nestjs/common';
import { InfoFilter, LatestNewsType } from '../dtos/supplierInfoDto';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { SupplierInfoRepository } from '../repositories/supplier-info.repository';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { ConfigService } from '@nestjs/config';
import { MediaTypes } from 'src/media/dtos/mediaDto';
import { UserStatus } from 'src/user/dtos/UserDto';
import { CategoryRepository } from 'src/category/repositories/category.repository';
import { HighlightRepository } from 'src/highlight/repositories/highlight.repository';
import { LatestNewsRepository } from 'src/latest-news/repositories/latest-news.repository';
import { CommonService } from 'src/shared/common.service';

@Injectable()
export class SupplierInfoService {
  constructor(
    private supplierRepo: SupplierRepository,
    private repository: SupplierInfoRepository,
    private mediaRepo: MediaRepository,
    private categoryRepository: CategoryRepository,
    private highlightRepo: HighlightRepository,
    private latestNewsRepo: LatestNewsRepository,
    private readonly config: ConfigService,
    private commonService: CommonService,
  ) {}

  async getInfo(infoFilter: InfoFilter) {
    const { slug } = infoFilter;
    const supplier = await this.supplierRepo
      .createQueryBuilder('suppliers')
      .leftJoinAndSelect('suppliers.user', 'user')
      .leftJoinAndSelect('suppliers.supplierInfo', 'supplierInfo')
      .where('suppliers.slug = :slug', { slug })
      .andWhere('user.status = :status', { status: UserStatus.APPROVED })
      .getOne();
    if (!supplier) {
      throw new NotFoundException();
    } else {
      let data = {};
      const info = supplier?.supplierInfo;
      if (info) {
        const atsMedia = info?.ats_media_id
          ? await this.mediaRepo.findOne({
              where: { id: info?.ats_media_id },
            })
          : null;
        const atsextension = atsMedia?.image?.split('.')[1];
        const atsname = atsMedia?.image?.split('.')[0];
        const atsMediaContent = atsMedia
          ? {
              id: atsMedia?.id,
              image: atsMedia?.image
                ? `${this.config.get(
                    's3.imageUrl',
                  )}/supplier-db/supplier/${supplier?.id}/${atsname}_${this.config.get(
                    's3.imageSize.medium',
                  )}.${atsextension}`
                : '',
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
        const serviceextension = serviceMedia?.image?.split('.')[1];
        const servicename = serviceMedia?.image?.split('.')[0];
        const serviceMediaContent = serviceMedia
          ? {
              id: serviceMedia?.id,
              image: serviceMedia?.image
                ? `${this.config.get(
                    's3.imageUrl',
                  )}/supplier-db/supplier/${supplier?.id}/${servicename}_${this.config.get(
                    's3.imageSize.medium',
                  )}.${serviceextension}`
                : '',
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
            ? await this.commonService.getThumbnailUrl(supplier?.mts_video)
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
          id: supplier?.id,
          info: {
            name: supplier?.name,
            slug: supplier?.slug,
            logo: supplier?.logo
              ? `${this.config.get(
                  's3.imageUrl',
                )}/supplier-db/supplier/${supplier?.id}/${supplier?.logo}`
              : `${this.config.get(
                  's3.imageUrl',
                )}/supplier-db/supplier/client-logo.png`,
            location:
              supplier?.city && supplier?.state
                ? `${supplier?.city}, ${supplier?.state}`
                : supplier?.city && !supplier?.state
                  ? `${supplier.state}`
                  : !supplier?.city && supplier?.state
                    ? `${supplier.city}`
                    : '',
            founded: supplier?.founded,
            rating: Number(supplier?.rating)?.toFixed(1) ?? 0,
            review: supplier?.review ?? 0,
            description: info?.ats_content,
            isFeatured: supplier?.is_featured ? supplier?.is_featured : false,
            media,
            category: await this.getCategory(supplier?.category_id),
            website: info?.website,
          },
          banner_media,
          highlight: await this.getHighlight(supplier?.id),
          about_the_supplier: {
            content: info?.ats_content,
            media: atsMediaContent ?? null,
          },
          services: {
            content: info?.service_content,
            media: serviceMediaContent ?? null,
          },
          latest_news: await this.getLatestNews(info),
        };
      }
      return data;
    }
  }

  async getCategory(categoryId) {
    let category = {};
    if (categoryId) {
      const categoryData = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (categoryData) {
        category = {
          id: categoryData?.id,
          name: categoryData?.name,
        };
      }
    }
    return category;
  }

  async getHighlight(supplierId) {
    let highlightData = {};
    if (supplierId) {
      const highlights = await this.highlightRepo.find({
        where: { supplier_id: supplierId },
      });
      const data = [];
      if (highlights?.length) {
        for (const highlight of highlights) {
          data.push({
            id: highlight?.id,
            logo: `${this.config.get(
              's3.imageUrl',
            )}/supplier-db/supplier/highlight.svg`,
            title: highlight?.title ?? 'Verified Profiles',
            content: highlight?.content,
          });
        }
        highlightData = { title: 'Supplier Highlights', data };
      }
    }
    return highlightData;
  }

  async getLatestNews(info) {
    let data = [];
    if (info) {
      if (info && info?.latest_news_type_id) {
        if (info?.latest_news_type_id === LatestNewsType.SELECT_STORIES) {
          const latestNews = await this.latestNewsRepo.findOne({
            where: { supplier_id: info?.supplier_id },
          });
          if (latestNews?.article_id) {
            const articles = latestNews?.article_id.split(',');
            for (const article of articles) {
              const result = await this.commonService.getArticleDetail(article);
              data.push(result);
            }
          }
        } else if (info?.latest_news_type_id === LatestNewsType.ALL_STORIES) {
          const result = await this.commonService.getLatestStories();
          data = result;
        } else if (info?.latest_news_type_id === LatestNewsType.MOST_POPULAR) {
          const result = await this.commonService.getMostPopularStories();
          data = result;
        } else if (
          info?.latest_news_type_id === LatestNewsType.LATEST_STORIES
        ) {
          const result = await this.commonService.getLatestStories();
          data = result;
        }
      }
    }
    return data;
  }
}
