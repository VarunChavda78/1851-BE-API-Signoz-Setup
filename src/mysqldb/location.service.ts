import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MysqlGALocationMetrics } from './entities/mysql-ga-location-metrics.entity';

interface Address {
  city: string;
  state: string;
  country: string;
}

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(MysqlGALocationMetrics, 'mysqldb')
    private repository: Repository<MysqlGALocationMetrics>
  ) {}

  async getGeocode(address: Address = null) {
    try {
      const data = await this.repository.findOne({
        select: {
          latitude: true,
          longitude: true,
        },
        where: {
          country: address?.country,
          state: address?.state,
          city: address?.city,
        },
      });
      return data;
    } catch (err) {
      console.log('err', err);
      return null;
    }
  }
}
