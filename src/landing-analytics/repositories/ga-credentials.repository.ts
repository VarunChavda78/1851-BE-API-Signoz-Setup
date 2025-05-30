
import { IsNull, LessThan, Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GACredential } from '../ga-credential.entity';

@Injectable()
export class GACredentialsRepository {
  constructor(
    @InjectRepository(GACredential)
    private repository: Repository<GACredential>,
  ) {}

  async findByBrandId(brandId: number): Promise<GACredential[]> {
    return this.repository.find({ 
      where: { brandId, isActive: true } 
    });
  }
  
  async findByLandingPageId(pageId: number): Promise<GACredential | undefined> {
    return this.repository.findOne({ 
      where: { landingPage: { id: pageId }, isActive: true } 
    });
  }
  
  async findExpiredTokens(): Promise<GACredential[]> {
    const now = new Date();
    return this.repository.find({ 
      where: { 
        expiresAt: LessThan(now), 
        isActive: true 
      } 
    });
  }

  async findOne(id: number): Promise<GACredential | undefined> {
    return this.repository.findOne({ where: { id } });
  }

  async save(credential: Partial<GACredential>): Promise<GACredential> {
    return this.repository.save(credential);
  }

  async create(credential: Partial<GACredential>): Promise<GACredential> {
    const newCredential = this.repository.create(credential);
    return this.repository.save(newCredential);
  }

  async findActiveWithPropertyId() {
    return this.repository.find({ 
      where: { 
        isActive: true,
        propertyId: Not(IsNull())
      },
      relations: ['landingPage']
    });
  }
}
