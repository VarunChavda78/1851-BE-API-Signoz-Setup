import { Test, TestingModule } from '@nestjs/testing';
import { SupplierLibraryService } from './supplier_library.service';
import { SupplierLibraryRepository } from '../repositories/supplier_library.repository';

describe('SupplierLibraryService', () => {
  let service: SupplierLibraryService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierLibraryService,
        {
          provide: SupplierLibraryRepository,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            getById: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<SupplierLibraryService>(SupplierLibraryService);
    mockedRepository = moduleRef.get(SupplierLibraryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
