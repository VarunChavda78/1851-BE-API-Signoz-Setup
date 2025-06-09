import { Controller, Get, Query } from '@nestjs/common';
import { LpPageRepository } from '../landing/lp-page.repository';
import { Between } from 'typeorm';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly lpPageRepository: LpPageRepository) {}

  @Get('metrics')
  async getMetrics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('brandId') brandId?: number
  ) {
    const where: any = {};
    
    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }
    
    if (brandId) {
      where.brandId = brandId;
    }

    const pages = await this.lpPageRepository.find({ where });

    const metrics = {
      totalPages: pages.length,
      publishedPages: pages.filter(p => p.status === 2).length,
      draftPages: pages.filter(p => p.status === 1).length,
      subdomainPages: pages.filter(p => p.domainType === 1).length,
      customDomainPages: pages.filter(p => p.domainType === 2).length,
      gaTrackedPages: pages.filter(p => p.gaCode).length,
      recentPublished: pages
        .filter(p => p.status === 2)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 10)
        .map(p => ({ name: p.name, createdAt: p.createdAt })),
      domainBreakdown: {
        subdomains: pages
          .filter(p => p.domainType === 1)
          .map(p => ({ name: p.name, domain: p.domain })),
        customDomains: pages
          .filter(p => p.domainType === 2)
          .map(p => ({ name: p.name, domain: p.domain })),
      },
      gaTrackedList: pages
        .filter(p => p.gaCode)
        .map(p => ({ name: p.name, gaCode: p.gaCode })),
    };

    return metrics;
  }
}
