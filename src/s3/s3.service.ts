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
import { lastValueFrom } from 'rxjs';
import * as sharp from 'sharp';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private logger = new Logger(S3Service.name);

  constructor(
    private configservice: ConfigService,
    private readonly rollbar: RollbarLogger,
    private httpService: HttpService
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

  getS3BaseUrl(siteId: string){
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
      return this.configservice.get('aws.s3Url');
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
  async convertSvgToPngAndUpload(url: string, path = '', siteId: string = '1851',): Promise<string> {
    // Fetch the SVG image
    try {
      this.init(siteId);
      const svgResponse = await lastValueFrom(
        this.httpService.get(url, { responseType: 'arraybuffer' }),
      );
      const svgBuffer = Buffer.from(svgResponse.data);
  
      // Convert and resize SVG to PNG ensuring the minimum size of 200x200 pixels
      const pngBuffer = await sharp(svgBuffer)
        .resize({
          width: 200,
          height: 200,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toBuffer();
  
      // Upload to S3
      // Remove leading slash if present and ensure proper path construction
      const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
      const fileNameWithPath = `${normalizedPath?.split('.')[0]}.png`;
      const fileUrl = `${this.getBaseUrl(siteId)}/${fileNameWithPath}`;
      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileNameWithPath,
        Body: pngBuffer,
        ContentType: 'image/png',
      };
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      return fileUrl;
    } catch (error) {
      this.logger.error(`Could not upload file: ${error.message}`, error.stack);
      this.rollbar.warning('Error in convert File method', error);
      return `Could not upload file: ${error.message}`
    }
  }

  async uploadCsvToS3(
    csvData: string,
    filename: string,
    path: string = 'landing-lead-exports/',
    siteId: string = '1851',
  ): Promise<{ url: string; message: string }> {
    try {
      if (path && !path.endsWith('/')) {
        path += '/';
      }
      this.init(siteId);
  

      const key = `${path}${filename}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: csvData,
        ContentType: 'text/csv',
      });
  
      await this.s3Client.send(command);
  
      const s3BaseUrl = this.getS3BaseUrl(siteId);
      const fileUrl = `${s3BaseUrl}/${key}`;
      return {
        message: 'CSV file uploaded successfully',
        url: fileUrl,
      };
    } catch (error) {
      this.logger.error('Error uploading csv file', error);
      this.rollbar.error(
        `${S3Service.name}.${this.uploadCsvToS3.name} - ${error.message}`,
        error,
      );
      throw error;
    }
  }
}
