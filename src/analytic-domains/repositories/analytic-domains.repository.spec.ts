import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AnalyticDomainsRepository } from './analytic-domains.repository';

describe('AnalyticDomainsRepository', () => {
  let repository: AnalyticDomainsRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticDomainsRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<AnalyticDomainsRepository>(
      AnalyticDomainsRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
