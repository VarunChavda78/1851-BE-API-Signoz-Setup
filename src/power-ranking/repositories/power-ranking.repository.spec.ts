import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { PowerRankingRepository } from './power-ranking.repository';

describe('PowerRankingRepository', () => {
  let repository: PowerRankingRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PowerRankingRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<PowerRankingRepository>(PowerRankingRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
