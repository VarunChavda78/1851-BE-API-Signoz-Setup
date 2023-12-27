import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { SocialPlatformRepository } from './social-platform.repository';

describe('SocialPlatformRepository', () => {
  let repository: SocialPlatformRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SocialPlatformRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<SocialPlatformRepository>(
      SocialPlatformRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
