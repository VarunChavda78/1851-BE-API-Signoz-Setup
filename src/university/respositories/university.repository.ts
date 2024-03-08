import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { University } from '../university.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UniversityRepository extends Repository<University> {
  constructor(
    private dataSource: DataSource,
    private config: ConfigService,
    ) {
    super(University, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<University> {
    const franchise = await this.findOne({ where: { id } });
    if (!franchise) {
      throw new NotFoundException();
    }
    return franchise;
  }

  // async moveS3Images(image: string, id: number): Promise<void> {
  //   const s3 = new S3({
  //     accessKeyId: this.config.get('aws.accessKey'),
  //     secretAccessKey: this.config.get('aws.secretKey'),
  //     region: this.config.get('aws.region'),
  //   });
  //   // Move images in S3
  //   const bucketName = this.config.get('aws.bucketName');
  //   const sourcePath = `${bucketName}/university/images/${image}`;
  //   const destinationPath = `admin-be-api/university/${id}/${image}`;
  //   if (image && id) {
  //     try {
  //       await s3
  //         .copyObject({
  //           Bucket: bucketName,
  //           CopySource: sourcePath,
  //           Key: destinationPath,
  //         })
  //         .promise();

  //       await s3
  //         .deleteObject({
  //           Bucket: bucketName,
  //           Key: `admin-be-api/images/${image}`,
  //         })
  //         .promise();
  //     } catch (e) {
  //       console.log(e, 'S3 Error');
  //     }
  //   }
  // }
}
