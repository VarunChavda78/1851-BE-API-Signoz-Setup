import { Test, TestingModule } from '@nestjs/testing';
import { LatestNewsService } from './latest_news.service';
import { LatestNewsRepository } from '../repositories/latest_news.repository';

describe('LatestNewsService', () => {
  let service: LatestNewsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LatestNewsService,
        {
          provide: LatestNewsRepository,
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

    service = moduleRef.get<LatestNewsService>(LatestNewsService);
    mockedRepository = moduleRef.get(LatestNewsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
