import {
  Controller,
  Post,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { RollbarLogger } from 'nestjs-rollbar';

@Controller({
  version: '1',
  path: 's3',
})

export class S3Controller {
  constructor(
    private readonly s3Service: S3Service,
    private readonly rollbar: RollbarLogger,
  ) {}

  // used in legacy portal image upload
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any, @Body() body: { path: string; fileName?: string, siteId?: string }) {
    try {
      this.rollbar.info('Uploading file..');
      const siteId = body?.siteId || '1851';

      // Handle file uploads
      const result = await this.s3Service.uploadFile(file, body.path, body?.fileName, siteId);
      return {
        message: 'Image successfully uploaded',
        data: {
          url: result.url,
          imagePath: result.imagePath,
        },
      };
    } catch (error) {
      this.rollbar.error('Error in upload File method', error);
      const msg = error?.message || 'Failed to upload image or thumbnail';
      throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('remove')
  async removeFile(@Query('key') key: string, @Query('siteId') siteId: string) {
    try {
      this.rollbar.info('removing file..');

      const result = await this.s3Service.deleteFile(key, siteId);
      return {
        message: 'File successfully deleted',
        data: {
          success: result,
        },
      };
    } catch (error) {
      this.rollbar.error('Error in delete File method', error);
      const msg = error?.message || 'Failed to delete file';
      throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('convert')
  async convertImage(@Body() body: { url: string; path: string; siteId?: string }) {
    try {
      this.rollbar.info('Uploading file..');
      const siteId = body?.siteId || '1851';

      // Handle file uploads
      const result = await this.s3Service.convertSvgToPngAndUpload(body.url, body.path, siteId);
      return {
        message: 'Image successfully uploaded',
        data: {
          url: result,
        },
      };
    } catch (error) {
      this.rollbar.error('Error in upload File method', error);
      const msg = error?.message || 'Failed to upload image or thumbnail';
      throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
