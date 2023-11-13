import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { ReviewRepository } from './review.repository';

describe('ReviewRepository', () => {
  let repository: ReviewRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<ReviewRepository>(ReviewRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
