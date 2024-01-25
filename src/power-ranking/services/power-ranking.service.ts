import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PowerRankingService {
  constructor(private readonly config: ConfigService) {}
}
