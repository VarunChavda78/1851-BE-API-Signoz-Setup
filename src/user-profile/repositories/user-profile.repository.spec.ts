import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserProfileRepository } from './user-profile.repository';

describe('UserProfileRepository', () => {
  let repository: UserProfileRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<UserProfileRepository>(UserProfileRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
