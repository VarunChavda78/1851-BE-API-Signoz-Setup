import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileService } from './user-profile.service';
import { UserProfileRepository } from '../repositories/user-profile.repository';

describe('UserProfileService', () => {
  let service: UserProfileService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileService,
        {
          provide: UserProfileRepository,
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

    service = moduleRef.get<UserProfileService>(UserProfileService);
    mockedRepository = moduleRef.get(UserProfileRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
