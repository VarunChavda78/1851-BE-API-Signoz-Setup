import { IsNull, LessThan, Not, Repository, DataSource, FindOneOptions, DeepPartial } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GACredential } from '../ga-credential.entity';

@Injectable()
export class GACredentialsRepository extends Repository<GACredential> {
  constructor(private dataSource: DataSource) {
    super(GACredential, dataSource.createEntityManager());
  }

  async findExpiredTokens(): Promise<GACredential[]> {
    const now = new Date();
    return this.find({
      where: {
        expiresAt: LessThan(now),
        isActive: true,
      },
    });
  }

  async findTokensToRefresh(expiryThreshold: Date): Promise<GACredential[]> {
    return this.find({
      where: {
        expiresAt: LessThan(expiryThreshold),
        isActive: true,
      },
    });
  }

  async findOneById(id: number): Promise<GACredential | null> {
    return this.findOne({ where: { id } } as FindOneOptions<GACredential>);
  }

  async createCredential(data: DeepPartial<GACredential>): Promise<GACredential> {
    const credential = this.create(data);
    return this.save(credential);
  }

  async findByLandingPageId(pageId: number): Promise<GACredential[]> {
    return this.find({
      where: {
        landingPage: { id: pageId },
        isActive: true,
      },
      relations: ['landingPage'],
    });
  }

  async findByBrandId(brandId: number): Promise<GACredential[]> {
    return this.find({
      where: {
        brandId,
        isActive: true,
      },
      relations: ['landingPage'],
    });
  }

  async findActiveWithPropertyId(landingPageId?: number) {
    const where: any = {
      isActive: true,
      propertyId: Not(IsNull()),
    };

    if (landingPageId) {
      where.landingPage = { id: landingPageId };
    }

    return this.find({
      where,
      relations: ['landingPage'],
    });
  }

  async deactivateByLandingPage(pageId: number): Promise<void> {
    await this.update(
      { landingPage: { id: pageId } },
      { isActive: false },
    );
  }

  async findByBrandAndPage(
    brandId: number,
    pageId: number,
  ): Promise<GACredential[]> {
    return this.find({
      where: {
        brandId,
        landingPage: { id: pageId },
        isActive: true,
      },
      relations: ['landingPage'],
    });
  }
}
