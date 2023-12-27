import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AnalyticDomains } from './entities/analytic-domains.entity';
import { AnalyticDomainsService } from './services/analytic-domains.service';
import { AnalyticDomainsRepository } from './repositories/analytic-domains.repository';
import { AnalyticDomainsController } from './controllers/analytic-domains.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticDomains])],
  providers: [AnalyticDomainsService, AnalyticDomainsRepository, ConfigService],
  controllers: [AnalyticDomainsController],
  exports: [AnalyticDomainsService],
})
export class AnalyticDomainsModule {}
