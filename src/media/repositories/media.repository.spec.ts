import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { MediaRepository } from './media.repository';

describe('MediaRepository', () => {
  let repository: MediaRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MediaRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<MediaRepository>(MediaRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
