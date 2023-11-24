import { Test, TestingModule } from '@nestjs/testing';
import { NewsletterService } from './newsletter.service';
import { NewsletterRepository } from '../repositories/newsletter.repository';

describe('NewsletterService', () => {
  let service: NewsletterService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        NewsletterService,
        {
          provide: NewsletterRepository,
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

    service = moduleRef.get<NewsletterService>(NewsletterService);
    mockedRepository = moduleRef.get(NewsletterRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
