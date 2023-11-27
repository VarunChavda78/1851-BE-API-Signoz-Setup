import { Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';
import { SupplierLibraryRepository } from '../repositories/supplier_library.repository';
import { PageMetaDto } from 'src/shared/dtos/pageMetaDto';
import { PageDto } from 'src/shared/dtos/pageDto';
import * as dayjs from 'dayjs';

@Injectable()
export class SupplierLibraryService {
  constructor(private repository: SupplierLibraryRepository) {}

  async getPlaylists(pageOptionsDto: PageOptionsDto) {
    const { page, limit, order, sort } = pageOptionsDto;
    const skip = (page - 1) * limit;
    const orderBy: any = order?.toUpperCase() ?? 'ASC';
    const queryBuilder = this.repository.createQueryBuilder('supplier_library');
    const itemCount = await queryBuilder.getCount();
    const playlists = await queryBuilder
      .orderBy(sort, orderBy)
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
      for (const playlist of playlists) {
        data.push(await this.getDetails(playlist));
      }
    }
    return data;
  }

  async getDetails(playlist) {
    let details = {};
    if (playlist) {
      details = {
        id: playlist?.id,
        video_id: playlist?.video_id,
        description: playlist?.description,
        title: playlist?.title,
        image: playlist?.image,
        url: playlist?.video_id,
        position: playlist?.position,
        publish_date: dayjs(playlist?.publish_date).format('YYYY-MM-DD'),
      };
    }
    return details;
  }
}
