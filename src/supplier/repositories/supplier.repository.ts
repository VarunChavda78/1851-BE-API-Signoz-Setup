import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { Supplier } from '../supplier.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupplierRepository extends Repository<Supplier> {
  constructor(
    private dataSource: DataSource,
    private config: ConfigService,
  ) {
    super(Supplier, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Supplier> {
    const supplier = await this.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException();
    }

    return supplier;
  }

  transformStringToArray(inputString: string): number[] {
    const stringArray = inputString.split(','); // Split the string into an array using ',' as the delimiter
    const numberArray = stringArray.map(Number); // Convert each element to a number

    return numberArray;
  }

  async moveS3Images(image: string, id: number): Promise<void> {
    const s3 = new S3({
      accessKeyId: this.config.get('aws.accessKey'),
      secretAccessKey: this.config.get('aws.secretKey'),
      region: this.config.get('aws.region'),
    });
    // Move images in S3
    const bucketName = this.config.get('aws.bucketName');
    const sourcePath = `${bucketName}/supplier-db/images/${image}`;
    const destinationPath = `supplier-db/supplier/${id}/${image}`;
    if (image && id) {
      try {
        await s3
          .copyObject({
            Bucket: bucketName,
            CopySource: sourcePath,
            Key: destinationPath,
          })
          .promise();

        await s3
          .deleteObject({
            Bucket: bucketName,
            Key: `supplier-db/images/${image}`,
          })
          .promise();
      } catch (e) {
        console.log(e, 'S3 Error');
      }
    }
  }
}
