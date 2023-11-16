import { MigrationInterface } from 'typeorm';
import * as csvParser from 'csv-parser';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { S3 } from 'aws-sdk';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { CategoryRepository } from 'src/category/repositories/category.repository';
import { ConfigService } from '@nestjs/config';

export class InsertSupplierData1700058900694 implements MigrationInterface {
  constructor(
    private supplierRepository: SupplierRepository,
    private categoryRepository: CategoryRepository,
    private config: ConfigService,
  ) {}
  public async up(): Promise<void> {
    const s3 = new S3();

    const suppliers: Supplier[] = [];
    const params = {
      Bucket: this.config.get('aws.bucketName'),
      Key: 'Supplier-db-data.csv',
    };

    s3.getObject(params)
      .createReadStream()
      .pipe(csvParser())
      .on('data', async (row) => {
        const data = new Supplier();
        const category: any = await this.categoryRepository.findOne({
          where: { name: row.Category },
        });
        console.log(category);
        data.name = row.Name;
        data.description = row.Description;
        data.location = `${row.City}, ${row.State}`;
        data.founded = row.Founded;
        data.isFeatured = row.isFeatured;
        data.categoryId = category.id;
        suppliers.push(data);
      })
      .on('end', async () => {
        await this.supplierRepository.save(suppliers);
      });
  }

  public async down(): Promise<void> {}
}
