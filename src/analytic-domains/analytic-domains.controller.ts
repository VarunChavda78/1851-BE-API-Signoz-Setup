import { Controller } from '@nestjs/common';

@Controller({
  version: '1',
  path: 'analytic-domains',
})
export class AnalyticDomainsController {
  constructor() {}
}
