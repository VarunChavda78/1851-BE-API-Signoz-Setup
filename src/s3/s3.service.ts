import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { RollbarLogger } from 'nestjs-rollbar';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private logger = new Logger(S3Service.name);

  constructor(
    private configservice: ConfigService,
    private readonly rollbar: RollbarLogger,
  ) {
    
  }

  async init(siteId: string) {
    if(siteId.trim() == 'Stachecow') { 
      this.bucketName = this.configservice.get('aws.bucketNameSc');
      this.s3Client = new S3Client({
        region: this.configservice.get('aws.region'),
        credentials: {
          accessKeyId: this.configservice.get('aws.accessKeySc'),
          secretAccessKey: this.configservice.get('aws.secretKeySc'),
        },
      });
    }
    else if(siteId.trim() == 'ROOM-1903') { 
      this.bucketName = this.configservice.get('aws.bucketName1903');
      this.s3Client = new S3Client({
        region: this.configservice.get('aws.region'),
        credentials: {
          accessKeyId: this.configservice.get('aws.accessKey1903'),
          secretAccessKey: this.configservice.get('aws.secretKey1903'),
        },
      });
    }
    else if(siteId.trim() == 'EE') { 
      this.bucketName = this.configservice.get('aws.bucketNameEe');
      this.s3Client = new S3Client({
        region: this.configservice.get('aws.region'),
        credentials: {
          accessKeyId: this.configservice.get('aws.accessKeyEe'),
          secretAccessKey: this.configservice.get('aws.secretKeyEe'),
        },
      });
    }
     else {
      this.bucketName = this.configservice.get('aws.bucketName');
      this.s3Client = new S3Client({
        region: this.configservice.get('aws.region'),
        credentials: {
          accessKeyId: this.configservice.get('aws.accessKey'),
          secretAccessKey: this.configservice.get('aws.secretKey'),
        },
      });
    }
    
  }

  getBaseUrl(siteId: string){
    if(siteId.trim() == 'Stachecow') {
      return this.configservice.get('aws.s3UrlSc');
    }
    else if(siteId.trim() == 'ROOM-1903') {
      return this.configservice.get('aws.s3Url1903');
    }
    else if(siteId.trim() == 'EE') {
      return this.configservice.get('aws.s3UrlEe');
    }
    else {
      return this.configservice.get('s3.imageUrl');
    }
  }

  async uploadFile(
    file: any,
    path: string = '',
    filename: string = '',
    siteId: string = '1851',
  ): Promise<{ url: string; imagePath: string; message: string }> {
    this.init(siteId);
    if (path && !path.endsWith('/')) {
      path += '/';
    }
    const finalFileName = filename || `${Date.now()}_${file.originalname}`;

    const key = `${path}${finalFileName}`;
    
    const fileUrl = `${this.getBaseUrl(siteId)}/${key}`;
    this.logger.debug(`key: ${key}, fileUrl: ${fileUrl}`);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);

      return {
        message: `File uploaded successfully`,
        url: fileUrl,
        imagePath: key,
      };
    } catch (error) {
      this.logger.error(`Could not upload file: ${error.message}`, error.stack);
      this.rollbar.warning('Error in upload File method', error);
      return {
        message: `Could not upload file: ${error.message}`,
        url: fileUrl,
        imagePath: key,
      };
    }
  }

  async deleteFile(key: string, siteId?: string): Promise<boolean> {
    this.init(siteId);
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not delete file: ${error.message}`,
      );
    }
  }
}
