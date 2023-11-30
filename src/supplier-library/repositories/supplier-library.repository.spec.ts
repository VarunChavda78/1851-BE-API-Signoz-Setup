import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { SupplierLibraryRepository } from './supplier-library.repository';

describe('SupplierLibraryRepository', () => {
  let repository: SupplierLibraryRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierLibraryRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<SupplierLibraryRepository>(
      SupplierLibraryRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
