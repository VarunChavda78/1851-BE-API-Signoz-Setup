import { Test, TestingModule } from '@nestjs/testing';
import { SupplierInfoService } from './supplier_info.service';
import { SupplierInfoRepository } from '../repositories/supplier_info.repository';

describe('SupplierInfoService', () => {
  let service: SupplierInfoService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierInfoService,
        {
          provide: SupplierInfoRepository,
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

    service = moduleRef.get<SupplierInfoService>(SupplierInfoService);
    mockedRepository = moduleRef.get(SupplierInfoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
