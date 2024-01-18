import { Controller, Get, Param, Query } from '@nestjs/common';
import { SupplierLibraryService } from './services/supplier-library.service';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';
import { SupplierLibraryRepository } from './repositories/supplier-library.repository';

@Controller({
  version: '1',
  path: 'playlist',
})
export class SupplierLibraryController {
  constructor(
    private service: SupplierLibraryService,
    private repository: SupplierLibraryRepository,
  ) {}

  @Get()
  async list(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.service.getPlaylists(pageOptionsDto);
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    const video = await this.repository.getById(id);
    const extension = video?.image?.split('.')[1];
    const name = video?.image?.split('.')[0];
    const imageName = `${name}.${extension}`;
    const data = await this.service.getDetails(video, imageName);
    return { data: data };
  }
}
