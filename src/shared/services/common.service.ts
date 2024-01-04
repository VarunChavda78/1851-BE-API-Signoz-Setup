import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CommonService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

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
    const thumbnailUrl = `${this.config.get(
      'youtube.baseUrl',
    )}/${videoId}/maxresdefault.jpg`;

    return thumbnailUrl;
  }

  async getVimeoThumbnail(videoUrl: string): Promise<string> {
    // Extract video ID from the Vimeo URL
    const videoId = videoUrl.split('/').pop();

    // Construct the Vimeo thumbnail URL (publicly accessible)
    const thumbnailUrl = `${this.config.get(
      'vimeo.baseUrl',
    )}/${videoId}_1280.jpg`;

    return thumbnailUrl;
  }

  async getArticleDetail(articleId) {
    const result = await this.http
      .get(`${this.config.get('franchise.feApi')}/story?id=${articleId}`)
      .toPromise()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => {
        console.error(error);
      });
    return result;
  }

  async getMostPopularStories() {
    const result = await this.http
      .get(
        `${this.config.get(
          'franchise.feApi',
        )}/articles/trending?limit=3&page=1`,
      )
      .toPromise()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => {
        console.error(error);
      });
    return result;
  }

  async getLatestStories() {
    const result = await this.http
      .get(
        `${this.config.get(
          'franchise.feApi',
        )}/articles/latest-stories?limit=3&page=1`,
      )
      .toPromise()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => {
        console.error(error);
      });
    return result;
  }
}
