import { Controller } from '@nestjs/common';
import { HighlightRepository } from '../repositories/highlight.repository';
import { HighlightService } from '../services/highlight.service';

@Controller({
  version: '1',
  path: 'highlight',
})
export class HighlightController {
  constructor(
    private repository: HighlightRepository,
    private service: HighlightService,
  ) {}
}
