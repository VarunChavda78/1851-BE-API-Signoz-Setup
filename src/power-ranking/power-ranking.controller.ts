import { Controller } from '@nestjs/common';

@Controller({
  version: '1',
  path: 'power-ranking',
})
export class PowerRankingController {
  constructor() {}
}
