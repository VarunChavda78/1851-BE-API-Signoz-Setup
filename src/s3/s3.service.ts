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
    this.bucketName = this.configservice.get('aws.bucketName');
    this.s3Client = new S3Client({
      region: this.configservice.get('aws.region'),
      credentials: {
        accessKeyId: this.configservice.get('aws.accessKey'),
        secretAccessKey: this.configservice.get('aws.secretKey'),
      },
    });

    if (!this.bucketName) {
      throw new Error('S3 bucket name is not configured.');
    }
  }

  async uploadFile(
    file: any,
    path: string = '',
  ): Promise<{ url: string; imagePath: string; message: string }> {
    if (path && !path.endsWith('/')) {
      path += '/';
    }
    const key = `${path}${Date.now()}_${file.originalname}`;
    const fileUrl = `${this.configservice.get('s3.imageUrl')}/${key}`;
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

  async deleteFile(key: string): Promise<boolean> {
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
