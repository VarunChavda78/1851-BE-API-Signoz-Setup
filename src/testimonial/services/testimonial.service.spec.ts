import { Test, TestingModule } from '@nestjs/testing';
import { TestimonialService } from './testimonial.service';
import { TestimonialRepository } from '../repositories/testimonial.repository';

describe('TestimonialService', () => {
  let service: TestimonialService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TestimonialService,
        {
          provide: TestimonialRepository,
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

    service = moduleRef.get<TestimonialService>(TestimonialService);
    mockedRepository = moduleRef.get(TestimonialRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
