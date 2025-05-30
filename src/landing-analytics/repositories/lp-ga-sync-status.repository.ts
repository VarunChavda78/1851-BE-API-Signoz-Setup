import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LpGaSyncStatus } from '../lp-ga-sync-status.entity';

@Injectable()
export class LpGaSyncStatusRepository {
  constructor(
    @InjectRepository(LpGaSyncStatus)
    private repository: Repository<LpGaSyncStatus>,
  ) {}

  async findByBrandId(brandId: number): Promise<LpGaSyncStatus> {
    return this.repository.findOne({
      where: {
        brandId,
        landingPage: null,
      },
    });
  }

  async findByBrandAndPage(
    brandId: number,
    landingPageId: number,
  ): Promise<LpGaSyncStatus> {
    return this.repository.findOne({
      where: {
        brandId,
        landingPage: { id: landingPageId },
      },
    });
  }

  async updateSyncStatus(
    brandId: number,
    landingPageId: number | null,
    status: string,
  ): Promise<LpGaSyncStatus> {
    if (!brandId) {
      throw new Error('Brand ID is required for sync status updates');
    }
  
    let syncStatus = await this.repository.findOne({
      where: {
        brandId,
        ...(landingPageId ? { landingPage: { id: landingPageId } } : { landingPage: null }),
      },
    });
  
    if (!syncStatus) {
      syncStatus = this.repository.create({
        brandId, // Ensure this is set
        ...(landingPageId ? { landingPage: { id: landingPageId } } : {}),
        lastSyncStatus: status,
        lastSynced: new Date(),
      });
    } else {
      syncStatus.lastSyncStatus = status;
      syncStatus.lastSynced = new Date();
    }
  
    return this.repository.save(syncStatus);
  }
  
}
