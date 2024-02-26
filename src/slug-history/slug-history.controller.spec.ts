import { Test, TestingModule } from '@nestjs/testing';
import { SlugHistoryController } from './slug-history.controller';

describe('SlugHistoryController', () => {
  let controller: SlugHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlugHistoryController],
    }).compile();

    controller = module.get<SlugHistoryController>(SlugHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
