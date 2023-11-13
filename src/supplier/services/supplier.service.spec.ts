import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from './supplier.service';
import { SupplierRepository } from '../repositories/supplier.repository';

describe('SupplierService', () => {
  let service: SupplierService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: SupplierRepository,
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

    service = moduleRef.get<SupplierService>(SupplierService);
    mockedRepository = moduleRef.get(SupplierRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
