import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { BrandRepository } from './brand.repository';

describe('BrandRepository', () => {
  let repository: BrandRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BrandRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<BrandRepository>(BrandRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
