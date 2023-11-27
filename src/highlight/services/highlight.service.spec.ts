import { Test, TestingModule } from '@nestjs/testing';
import { HighlightService } from './highlight.service';
import { HighlightRepository } from '../repositories/highlight.repository';

describe('HighlightService', () => {
  let service: HighlightService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        HighlightService,
        {
          provide: HighlightRepository,
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

    service = moduleRef.get<HighlightService>(HighlightService);
    mockedRepository = moduleRef.get(HighlightRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
