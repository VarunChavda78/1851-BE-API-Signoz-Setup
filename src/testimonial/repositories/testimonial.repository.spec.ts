import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { TestimonialRepository } from './testimonial.repository';

describe('TestimonialRepository', () => {
  let repository: TestimonialRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TestimonialRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<TestimonialRepository>(TestimonialRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
