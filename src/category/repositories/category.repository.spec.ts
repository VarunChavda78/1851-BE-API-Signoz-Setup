import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { CategoryRepository } from './category.repository';

describe('CategoryRepository', () => {
  let repository: CategoryRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
