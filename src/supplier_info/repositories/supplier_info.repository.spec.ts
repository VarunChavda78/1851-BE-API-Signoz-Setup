import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { SupplierInfoRepository } from './supplier_info.repository';

describe('SupplierInfoRepository', () => {
  let repository: SupplierInfoRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierInfoRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<SupplierInfoRepository>(SupplierInfoRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
