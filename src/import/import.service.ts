import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImportService {
  constructor(private readonly configService: ConfigService) {}

  async isUrl(s) {
    const regexp =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
  }

  async getThumbnailUrl(url) {
    const vimeo = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
    const youtube =
      /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
    let thumbnail = null;
    if (youtube.test(url)) {
      thumbnail = await this.getYoutubeThumbnail(url);
    } else if (vimeo.test(url)) {
      thumbnail = await this.getVimeoThumbnail(url);
    }
    return thumbnail;
  }

  async getYoutubeThumbnail(videoUrl: string): Promise<string> {
    // Extract video ID from the YouTube URL
    const videoId = videoUrl.split('v=')[1];

    // Construct the YouTube thumbnail URL
    const thumbnailUrl = `${this.configService.get(
      'youtube.baseUrl',
    )}/${videoId}/maxresdefault.jpg`;

    return thumbnailUrl;
  }

  async getVimeoThumbnail(videoUrl: string): Promise<string> {
    // Extract video ID from the Vimeo URL
    const videoId = videoUrl.split('/').pop();

    // Construct the Vimeo thumbnail URL (publicly accessible)
    const thumbnailUrl = `${this.configService.get(
      'vimeo.baseUrl',
    )}/${videoId}_1280.jpg`;

    return thumbnailUrl;
  }
}
