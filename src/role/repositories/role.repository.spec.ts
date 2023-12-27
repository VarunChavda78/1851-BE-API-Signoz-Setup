import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { RoleRepository } from './role.repository';

describe('RoleRepository', () => {
  let repository: RoleRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        RoleRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<RoleRepository>(RoleRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
