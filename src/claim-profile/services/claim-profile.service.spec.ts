import { Test, TestingModule } from '@nestjs/testing';
import { ClaimProfileService } from './claim-profile.service';
import { ClaimProfileRepository } from '../repositories/claim-profile.repository';

describe('ClaimProfileService', () => {
  let service: ClaimProfileService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimProfileService,
        {
          provide: ClaimProfileRepository,
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

    service = moduleRef.get<ClaimProfileService>(ClaimProfileService);
    mockedRepository = moduleRef.get(ClaimProfileRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
