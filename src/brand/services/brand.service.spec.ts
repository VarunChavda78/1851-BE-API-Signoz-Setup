import { Test, TestingModule } from '@nestjs/testing';
import { BrandService } from './brand.service';
import { BrandRepository } from '../repositories/brand.repository';

describe('BrandService', () => {
  let service: BrandService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        {
          provide: BrandRepository,
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

    service = moduleRef.get<BrandService>(BrandService);
    mockedRepository = moduleRef.get(BrandRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
