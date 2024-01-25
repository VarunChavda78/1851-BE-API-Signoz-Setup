import { Test, TestingModule } from '@nestjs/testing';
import { PowerRankingService } from './power-ranking.service';
import { PowerRankingRepository } from '../repositories/power-ranking.repository';

describe('PowerRankingService', () => {
  let service: PowerRankingService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PowerRankingService,
        {
          provide: PowerRankingRepository,
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

    service = moduleRef.get<PowerRankingService>(PowerRankingService);
    mockedRepository = moduleRef.get(PowerRankingRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
