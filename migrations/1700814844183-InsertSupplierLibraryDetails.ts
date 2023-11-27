import { MigrationInterface, QueryRunner } from 'typeorm';
import axios from 'axios';
import * as dayjs from 'dayjs';

export class InsertSupplierLibraryDetails1700814844183
  implements MigrationInterface
{
  public async up(_queryRunner: QueryRunner): Promise<void> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const videos: any[] = [];
    let nextPageToken: string | undefined = undefined;
    do {
      const response = await axios.get(
        `${process.env.YOUTUBE_PLAYLIST_API_URL}`,
        {
          params: {
            part: 'snippet',
            playlistId: process.env.YOUTUBE_PLAYLIST_ID,
            key: apiKey,
            maxResults: 50, // Adjust as needed, max is 50
            pageToken: nextPageToken,
          },
        },
      );

      videos.push(...response.data.items);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);
    for (const item of videos) {
      const date: any = dayjs(new Date(item?.snippet?.publishedAt)).format(
        'YYYY-MM-DD',
      );
      await _queryRunner.query(
        `
        INSERT INTO supplier_library (video_id, description, title, image, url, position, publish_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
        [
          item?.snippet?.resourceId?.videoId,
          item?.snippet?.description ?? null,
          item?.snippet?.title ?? null,
          item?.snippet?.thumbnails?.high?.url,
          `https://www.youtube.com/watch?v=${item?.snippet?.resourceId?.videoId}`,
          item?.snippet?.position,
          date,
        ],
      );
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      TRUNCATE TABLE supplier_library;
    `);
  }
}
