import { Injectable, NotFoundException } from '@nestjs/common';
import { LatestNewsRepository } from '../repositories/latest-news.repository';
import { LatestNewsDto } from '../dtos/latestNewsDto';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';
import { PageMetaDto } from 'src/shared/dtos/pageMetaDto';
import { PageDto } from 'src/shared/dtos/pageDto';
import { UserStatus } from 'src/user/dtos/UserDto';
import { SupplierInfoRepository } from 'src/supplier-info/repositories/supplier-info.repository';
import { LatestNewsType } from 'src/supplier-info/dtos/supplierInfoDto';
import { CommonService } from 'src/shared/services/common.service';

@Injectable()
export class LatestNewsService {
  constructor(
    private repository: LatestNewsRepository,
    private supplierRepo: SupplierRepository,
    private infoRepo: SupplierInfoRepository,
    private commonService: CommonService,
  ) {}

  async listLatestNews(filter: LatestNewsDto, pageOptionsDto: PageOptionsDto) {
    const { slug } = filter;
    const { page, limit } = pageOptionsDto;
    const supplier = await this.supplierRepo
      .createQueryBuilder('suppliers')
      .leftJoinAndSelect('suppliers.user_id', 'user_id')
      .where('suppliers.slug = :slug', { slug })
      .andWhere('user_id.status = :status', { status: UserStatus.APPROVED })
      .getOne();
    if (!supplier) {
      throw new NotFoundException();
    } else {
      let data = [];
      const info = await this.infoRepo.findOne({
        where: { supplier_id: supplier?.id },
      });
      if (info && info?.latest_news_type_id) {
        if (info?.latest_news_type_id === LatestNewsType.SELECT_STORIES) {
          const latestNews = await this.repository.findOne({
            where: { supplier_id: supplier?.id },
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

      const itemCount: number = Number(data?.length);
      const finalResult = data.slice((page - 1) * limit, page * limit);
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(finalResult, pageMetaDto);
    }
  }
}
