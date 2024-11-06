import {
  Controller,
  Post,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { RollbarLogger } from 'nestjs-rollbar';

@Controller('s3')
export class S3Controller {
  constructor(
    private readonly s3Service: S3Service,
    private readonly rollbar: RollbarLogger,
  ) {}

  // used in legacy portal image upload
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any, @Query('path') path?: string) {
    try {
      // Handle file uploads
      const result = await this.s3Service.uploadFile(file, path);
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
      throw new HttpException(msg, HttpStatus.NOT_FOUND);
    }
  }

  @Delete('delete')
  async deleteFile(@Query('key') key: string) {
    try {
      const result = await this.s3Service.deleteFile(key);
      return {
        message: 'File successfully deleted',
        data: {
          success: result,
        },
      };
    } catch (error) {
      this.rollbar.error('Error in delete File method', error);
      const msg = error?.message || 'Failed to delete file';
      throw new HttpException(msg, HttpStatus.NOT_FOUND);
    }
  }
}
