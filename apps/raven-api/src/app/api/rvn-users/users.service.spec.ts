import { CryptoHelper } from '@app/rvnb-crypto';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AclService } from '../rvn-acl/acl.service';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { TeamsService } from '../rvn-teams/teams.service';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
        {
          provide: TeamsService,
          useValue: {},
        },
        {
          provide: AclService,
          useValue: {},
        },
        {
          provide: CryptoHelper,
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: {},
        },
        {
          provide: RavenLogger,
          useValue: {
            setContext: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
