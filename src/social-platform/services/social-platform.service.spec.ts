import { Test, TestingModule } from '@nestjs/testing';
import { SocialPlatformService } from './social-platform.service';
import { SocialPlatformRepository } from '../repositories/social-platform.repository';

describe('SocialPlatformService', () => {
  let service: SocialPlatformService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SocialPlatformService,
        {
          provide: SocialPlatformRepository,
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

    service = moduleRef.get<SocialPlatformService>(SocialPlatformService);
    mockedRepository = moduleRef.get(SocialPlatformRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
