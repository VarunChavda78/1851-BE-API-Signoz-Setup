import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ClaimProfileRepository } from './claim-profile.repository';

describe('ClaimProfileRepository', () => {
  let repository: ClaimProfileRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimProfileRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<ClaimProfileRepository>(ClaimProfileRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
