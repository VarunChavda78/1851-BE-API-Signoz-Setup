import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { ConfigService } from '@nestjs/config';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { CategoryRepository } from 'src/category/repositories/category.repository';
import { HighlightRepository } from 'src/highlight/repositories/highlight.repository';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { SupplierInfoRepository } from 'src/supplier-info/repositories/supplier-info.repository';
import { LatestNewsRepository } from 'src/latest-news/repositories/latest-news.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserProfileRepository } from 'src/user-profile/repositories/user-profile.repository';
import { SocialPlatformRepository } from 'src/social-platform/repositories/social-platform.repository';

@Module({
  imports: [],
  providers: [
    ImportService,
    ConfigService,
    SupplierRepository,
    CategoryRepository,
    HighlightRepository,
    MediaRepository,
    SupplierInfoRepository,
    LatestNewsRepository,
    UserRepository,
    UserProfileRepository,
    SocialPlatformRepository,
  ],
  controllers: [ImportController],
  exports: [ImportService],
})
export class ImportModule {}
