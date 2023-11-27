import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { NewsletterRepository } from './newsletter.repository';

describe('NewsletterRepository', () => {
  let repository: NewsletterRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        NewsletterRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<NewsletterRepository>(NewsletterRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
