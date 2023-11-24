import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { LatestNewsRepository } from './latest_news.repository';

describe('LatestNewsRepository', () => {
  let repository: LatestNewsRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LatestNewsRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<LatestNewsRepository>(LatestNewsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
