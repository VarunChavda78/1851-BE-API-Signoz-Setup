import { Test, TestingModule } from '@nestjs/testing';
import { SlugHistoryService } from './slug-history.service';

describe('SlugHistoryService', () => {
  let service: SlugHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlugHistoryService],
    }).compile();

    service = module.get<SlugHistoryService>(SlugHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
