import { Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';
import { SupplierLibraryRepository } from '../repositories/supplier-library.repository';
import { PageMetaDto } from 'src/shared/dtos/pageMetaDto';
import { PageDto } from 'src/shared/dtos/pageDto';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupplierLibraryService {
  constructor(
    private repository: SupplierLibraryRepository,
    private readonly config: ConfigService,
  ) {}

  async getPlaylists(pageOptionsDto: PageOptionsDto) {
    const { page, limit, order, sort } = pageOptionsDto;
    const skip = page ? (page - 1) * limit : 0;
    const sorting = sort ? sort : 'position';
    const orderBy: any = order?.toUpperCase() ?? 'ASC';
    const queryBuilder = this.repository.createQueryBuilder('supplier_library');
    const itemCount = await queryBuilder.getCount();
    const playlists = await queryBuilder
      .orderBy(sorting, orderBy)
      .skip(skip)
      .take(limit)
      .getMany();

    const data = await this.getData(playlists);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, pageMetaDto);
  }

  async getData(playlists) {
    const data = [];
    if (playlists.length) {
      for (const [index, playlist] of playlists.entries()) {
        const extension = playlist?.image?.split('.')[1];
        const name = playlist?.image?.split('.')[0];
        // const imageName =
        //   index === 0
        //     ? `${name}_854x480.${extension}`
        //     : `${name}_544x306.${extension}`;
        const imageName = `${name}.${extension}`;
        data.push(await this.getDetails(playlist, imageName));
      }
    }
    return data;
  }

  async getDetails(playlist, imageName) {
    let details = {};
    if (playlist) {
      details = {
        id: playlist?.id,
        video_id: playlist?.video_id,
        description: playlist?.description,
        title: playlist?.title,
        image: `${this.config.get(
          's3.imageUrl',
        )}/supplier-db/videos/${imageName}`,
        url: playlist?.url,
        position: playlist?.position,
        publish_date: dayjs(playlist?.publish_date).format(
          'MMMM D, YYYY h:mm a',
        ),
      };
    }
    return details;
  }
}
