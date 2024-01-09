import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImportService {
  constructor(private readonly configService: ConfigService) {}
}
