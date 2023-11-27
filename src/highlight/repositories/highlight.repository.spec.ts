import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { HighlightRepository } from './highlight.repository';

describe('HighlightRepository', () => {
  let repository: HighlightRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        HighlightRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<HighlightRepository>(HighlightRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
