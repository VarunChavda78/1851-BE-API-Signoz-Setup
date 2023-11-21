import { Controller, Get } from '@nestjs/common';
import { LayoutService } from '../services/layout.service';
import * as csvParser from 'csv-parser';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import * as AWS from 'aws-sdk';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { CategoryRepository } from 'src/category/repositories/category.repository';
import { ConfigService } from '@nestjs/config';
import * as lodash from 'lodash';

@Controller({
  version: '1',
})
export class LayoutController {
  constructor(
    private layoutService: LayoutService,
    private supplierRepository: SupplierRepository,
    private categoryRepository: CategoryRepository,
    private config: ConfigService,
  ) {}

  @Get('top-header')
  async getTopHeader() {
    const data = await this.layoutService.getheader();
    return { data: data };
  }

  @Get('footer')
  async footer() {
    const data = await this.layoutService.getFooter();
    return { data: data };
  }

  @Get('benefits')
  async benefits() {
    const data = await this.layoutService.brandBenefits();
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
      Key: 'supplier-db/Supplier-db-data.csv',
    };

    s3.getObject(params)
      .createReadStream()
      .pipe(csvParser())
      .on('data', async (row) => {
        const data = new Supplier();
        const category: any = await this.categoryRepository.findOne({
          where: { name: row.Category },
        });
        data.name = row.Name;
        data.slug = lodash.kebabCase(row.Name);
        data.description = row?.Description;
        data.location =
          row?.City && row?.State
            ? `${row?.City}, ${row?.State}`
            : row?.City && !row?.State
              ? `${row.State}`
              : !row?.City && row?.State
                ? `${row.City}`
                : '';
        data.founded = Number(row?.Founded);
        data.isFeatured = row?.isFeatured === 'Yes' ? true : false;
        data.categoryId = Number(category?.id);
        data.logo = row?.Logo;
        data.videoUrl = row?.Video;
        data.rating = row?.Rating;
        await this.supplierRepository.save(data);
      });
    return true;
  }
}
