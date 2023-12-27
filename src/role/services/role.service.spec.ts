import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleRepository } from '../repositories/role.repository';

describe('RoleService', () => {
  let service: RoleService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockedRepository: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
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

    service = moduleRef.get<RoleService>(RoleService);
    mockedRepository = moduleRef.get(RoleRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
