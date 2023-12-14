import { Controller, Get, Query } from '@nestjs/common';
import { LayoutService } from '../services/layout.service';
import * as csvParser from 'csv-parser';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import * as AWS from 'aws-sdk';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { CategoryRepository } from 'src/category/repositories/category.repository';
import { ConfigService } from '@nestjs/config';
import * as lodash from 'lodash';
import { HighlightRepository } from 'src/highlight/repositories/highlight.repository';
import { SupplierInfoRepository } from 'src/supplier-info/repositories/supplier-info.repository';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { LatestNewsRepository } from 'src/latest-news/repositories/latest-news.repository';
import { LayoutDto } from '../dtos/layoutDto';

@Controller({
  version: '1',
})
export class LayoutController {
  constructor(
    private layoutService: LayoutService,
    private supplierRepository: SupplierRepository,
    private highlightRepository: HighlightRepository,
    private categoryRepository: CategoryRepository,
    private supplierInfoRepository: SupplierInfoRepository,
    private latestNewsRepo: LatestNewsRepository,
    private mediaRepo: MediaRepository,
    private config: ConfigService,
  ) {}

  @Get('top-header')
  async getTopHeader() {
    const data = await this.layoutService.getheader();
    return { data: data };
  }

  @Get('footer')
  async footer(@Query() params: LayoutDto) {
    const data = await this.layoutService.getFooter(params?.slug);
    return { data: data };
  }

  @Get('benefits')
  async benefits() {
    const data = await this.layoutService.brandBenefits();
    return data;
  }

  @Get('state')
  async state() {
    const data = await this.layoutService.getStates();
    return { data: data };
  }

  @Get('save-supplier')
  async saveSupplier() {
    AWS.config.update({
      accessKeyId: this.config.get('aws.accessKey'),
      secretAccessKey: this.config.get('aws.secretKey'),
      region: this.config.get('aws.region'),
    });
    const s3 = new AWS.S3();

    const params = {
      Bucket: this.config.get('aws.bucketName'),
      Key: 'supplier-db/sb-data.csv',
    };

    s3.getObject(params)
      .createReadStream()
      .pipe(csvParser())
      .on('data', async (row) => {
        const data = new Supplier();
        const category: any = await this.categoryRepository.findOne({
          where: { name: row?.Category },
        });
        data.name = row.Name;
        data.slug = lodash.kebabCase(row.Name);
        data.description = row?.Description;
        data.city = row?.City ?? null;
        data.state = row?.State ?? null;
        data.founded = row?.Founded ? Number(row?.Founded) : null;
        data.is_featured = row?.isFeatured === 'Yes' ? true : false;
        data.category_id = category?.id ? Number(category?.id) : null;
        data.logo = row?.Logo;
        data.video_url = row?.Video ?? null;
        data.rating = row?.Rating ? Number(row?.Rating) : 0;
        data.score = row?.Rating ? Number(row?.Rating) : 0;
        const supplier = await this.supplierRepository.save(data);
        const highlightData1 = {
          supplier_id: supplier?.id,
          logo: row?.['Highlight Logo1'],
          title: row?.['Highlight Summary1'],
          content: row?.['Highlight Content1'],
        };
        await this.highlightRepository.save(highlightData1);
        const highlightData2 = {
          supplier_id: supplier?.id,
          logo: row?.['Highlight Logo2'],
          title: row?.['Highlight Summary2'],
          content: row?.['Highlight Content2'],
        };
        await this.highlightRepository.save(highlightData2);
        const highlightData3 = {
          supplier_id: supplier?.id,
          logo: row?.['Highlight Logo3'],
          title: row?.['Highlight Summary3'],
          content: row?.['Highlight Content3'],
        };
        await this.highlightRepository.save(highlightData3);

        const mtsImage = (await this.layoutService.isUrl(
          row?.['Meet The Supplier Media'],
        ))
          ? await this.layoutService.getThumbnailUrl(
              row?.['Meet The Supplier Media'],
            )
          : row?.['Meet The Supplier Media'];
        const mtsMediaData = {
          image: mtsImage,
          url: (await this.layoutService.isUrl(
            row?.['Meet The Supplier Media'],
          ))
            ? row?.['Meet The Supplier Media']
            : null,
          type: (await this.layoutService.isUrl(
            row?.['Meet The Supplier Media'],
          ))
            ? 'video'
            : 'image',
        };
        const mtsMedia = await this.mediaRepo.save(mtsMediaData);
        const differenceImage = (await this.layoutService.isUrl(
          row?.['Supplier Difference Media'],
        ))
          ? await this.layoutService.getThumbnailUrl(
              row?.['Supplier Difference Media'],
            )
          : row?.['Supplier Difference Media'];
        const differenceMediaData = {
          image: differenceImage,
          url: (await this.layoutService.isUrl(
            row?.['Supplier Difference Media'],
          ))
            ? row?.['Supplier Difference Media']
            : null,
          type: (await this.layoutService.isUrl(
            row?.['Supplier Difference Media'],
          ))
            ? 'video'
            : 'image',
        };
        const differenceMedia = await this.mediaRepo.save(differenceMediaData);
        const info = {
          supplier_id: supplier?.id,
          highlight_title: row?.['Highlight Title'],
          mts_media_id: mtsMedia?.id,
          mts_content: row?.['Meet The Supplier Text'],
          difference_media_id: differenceMedia?.id,
          difference_content: row?.['Supplier Difference'],
          services: row?.['Services'],
        };
        await this.supplierInfoRepository.save(info);
        const news = {
          supplier_id: supplier?.id,
          article_id: row?.['News Article IDs'],
        };
        await this.latestNewsRepo.save(news);
      });
    return true;
  }
}
