import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { SupplierRepository } from './supplier.repository';

describe('SupplierRepository', () => {
  let repository: SupplierRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<SupplierRepository>(SupplierRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
