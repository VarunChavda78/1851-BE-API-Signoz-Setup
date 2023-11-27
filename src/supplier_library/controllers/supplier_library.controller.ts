import { Controller, Get, Param, Query } from '@nestjs/common';
import { SupplierLibraryService } from '../services/supplier_library.service';
import { PageOptionsDto } from 'src/shared/dtos/pageOptionsDto';
import { SupplierLibraryRepository } from '../repositories/supplier_library.repository';

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
    const data = await this.service.getDetails(video);
    return { data: data };
  }
}
