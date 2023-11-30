import { Injectable, NotFoundException } from '@nestjs/common';
import { LatestNewsRepository } from '../repositories/latest_news.repository';
import { LatestNewsDto } from '../dtos/latestNewsDto';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { HttpService } from '@nestjs/axios';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';
import { PageMetaDto } from 'src/shared/dtos/pageMetaDto';
import { PageDto } from 'src/shared/dtos/pageDto';

@Injectable()
export class LatestNewsService {
  constructor(
    private repository: LatestNewsRepository,
    private supplierRepo: SupplierRepository,
    private http: HttpService,
  ) {}

  async listLatestNews(filter: LatestNewsDto, pageOptionsDto: PageOptionsDto) {
    const { slug } = filter;
    const { page, limit } = pageOptionsDto;
    const supplier = await this.supplierRepo.findOne({ where: { slug } });
    if (!supplier) {
      throw new NotFoundException();
    } else {
      const latestNews = await this.repository.findOne({
        where: { supplier_id: supplier?.id },
      });
      const data = [];
      if (latestNews?.article_id) {
        const articles = latestNews?.article_id.split(', ');
        for (const article of articles) {
          const result = await this.getArticleDetail(article);
          data.push(result);
        }
      }
      const itemCount: number = Number(data?.length);
      const finalResult = data.slice((page - 1) * limit, page * limit);
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(finalResult, pageMetaDto);
    }
  }

  async getArticleDetail(articleId) {
    const result = await this.http
      .get(`https://apiuser.1851franchise.com/api/v1/story?id=${articleId}`)
      .toPromise()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => {
        console.error(error);
      });
    return result;
  }
}
