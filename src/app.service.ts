import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Welcome to Supplier DB!';
  }
}
