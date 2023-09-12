import { CryptoHelper } from '@app/rvnb-crypto';

import { UserSessionEntity } from './entities/user-session.entity';
import { UsersSessionsService } from './users-sessions.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersSessionsService', () => {
  let service: UsersSessionsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersSessionsService,
        {
          provide: getRepositoryToken(UserSessionEntity),
          useValue: {},
        },
        {
          provide: CryptoHelper,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersSessionsService>(UsersSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
