import { Controller, Get } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import { Supplier } from 'src/supplier/supplier.entity';
import * as AWS from 'aws-sdk';
import { SupplierRepository } from 'src/supplier/repositories/supplier.repository';
import { ConfigService } from '@nestjs/config';
import * as lodash from 'lodash';
import { SupplierInfoRepository } from 'src/supplier-info/repositories/supplier-info.repository';
import { RoleLists } from 'src/role/dtos/RoleDto';
import { UserStatus } from 'src/user/dtos/UserDto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserProfileRepository } from 'src/user-profile/repositories/user-profile.repository';
import { SocialPlatformRepository } from 'src/social-platform/repositories/social-platform.repository';
import { SocialPlatforms } from 'src/social-platform/dtos/SocialPlatformDto';

@Controller({
  version: '1',
})
export class ImportController {
  constructor(
    private supplierRepository: SupplierRepository,
    private supplierInfoRepository: SupplierInfoRepository,
    private socialRepo: SocialPlatformRepository,
    private userRepo: UserRepository,
    private userProfileRepo: UserProfileRepository,
    private config: ConfigService,
  ) {}

  @Get('update-logo')
  async updateLogo() {
    AWS.config.update({
      accessKeyId: this.config.get('aws.accessKey'),
      secretAccessKey: this.config.get('aws.secretKey'),
      region: this.config.get('aws.region'),
    });
    const s3 = new AWS.S3();

    const suppliers = await this.supplierRepository
      .createQueryBuilder('suppliers')
      .getMany();
    suppliers.forEach(async function (supplier: any) {
      const bucketName = this.config.get('aws.bucketName');
      const sourcePath = `${bucketName}/supplier-db/images/${supplier.logo}`;
      const destinationPath = `supplier-db/supplier/${supplier.id}/${supplier.logo}`;
      try {
        await s3
          .copyObject({
            Bucket: bucketName,
            CopySource: sourcePath,
            Key: destinationPath,
          })
          .promise();

        await s3
          .deleteObject({
            Bucket: bucketName,
            Key: `supplier-db/images/${supplier.logo}`,
          })
          .promise();
      } catch (e) {
        console.log(e, 'S3 Error');
      }
    });
  }
  @Get('save-supplier')
  async saveSupplier() {
    AWS.config.update({
      accessKeyId: this.config.get('aws.accessKey'),
      secretAccessKey: this.config.get('aws.secretKey'),
      region: this.config.get('aws.region'),
    });
    const s3 = new AWS.S3();

    const params = {
      Bucket: this.config.get('aws.bucketName'),
      Key: 'supplier-db/sdb-final-data.csv',
    };

    s3.getObject(params)
      .createReadStream()
      .pipe(csvParser())
      .on('data', async (row) => {
        const userData = {
          role_id: RoleLists.SUPPLIER,
          user_name: '',
          email: '',
          password: '',
          phone: '',
          status: UserStatus.APPROVED,
        };
        const user = await this.userRepo.save(userData);
        await this.userProfileRepo.save({ user_id: user.id });
        const data = new Supplier();
        data.name = row.Name;
        data.slug = lodash.kebabCase(row.Name);
        data.city = row?.City ?? null;
        data.state = row?.State ?? null;
        data.founded = row?.Founded ? row?.Founded : null;
        data.is_featured = row?.IsFeatured == 1 ? true : false;
        data.category_id = row?.['Category ID']
          ? Number(row?.['Category ID'])
          : null;
        data.logo = row?.Logo;
        data.mts_video = row?.['Meet The Supplier'] ?? null;
        const supplier = await this.supplierRepository.save(data);
        supplier.user = user;
        await this.supplierRepository.save(supplier);
        if (supplier) {
          const info = {
            supplierId: supplier?.id,
            highlight_title: null,
            ats_media_id: null,
            service_media_id: null,
            service_content: null,
            ats_content: row?.['Company Overview'] ?? null,
            latest_news_type_id: null,
            website: row?.['Company website'] ?? null,
          };
          await this.supplierInfoRepository.save(info);
          const socialLinks = [
            'Facebook URL',
            'Instagram',
            'Twitter',
            'LinkedIn',
            'YouTube',
          ];
          for (const socialLink of socialLinks) {
            if (row?.[socialLink]) {
              await this.socialRepo.save({
                user_id: user.id,
                type:
                  socialLink === 'Facebook URL'
                    ? SocialPlatforms.FACEBOOK
                    : socialLink === 'Instagram'
                      ? SocialPlatforms.INSTAGRAM
                      : socialLink === 'Twitter'
                        ? SocialPlatforms.TWITTER
                        : socialLink === 'LinkedIn'
                          ? SocialPlatforms.LINKEDIN
                          : socialLink === 'YouTube'
                            ? SocialPlatforms.YOUTUBE
                            : null,
                url: row?.[socialLink],
              });
            }
          }
          await this.supplierRepository.moveS3Images(
            row?.Logo.trim(),
            supplier?.id,
          );
        }
      });
    return true;
  }
}
