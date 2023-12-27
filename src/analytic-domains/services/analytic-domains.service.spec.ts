import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticDomainsService } from './analytic-domains.service';
import { AnalyticDomainsRepository } from '../repositories/analytic-domains.repository';

describe('AnalyticDomainsService', () => {
  let service: AnalyticDomainsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticDomainsService,
        {
          provide: AnalyticDomainsRepository,
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

    service = moduleRef.get<AnalyticDomainsService>(AnalyticDomainsService);
    mockedRepository = moduleRef.get(AnalyticDomainsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
