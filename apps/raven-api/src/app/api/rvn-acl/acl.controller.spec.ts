import { EntityManager } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../rvn-users/users.service';
import { AclController } from './acl.controller';
import { AclService } from './acl.service';
import { AuthorizationService } from './authorization.service';

describe('AclController', () => {
  let controller: AclController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AclController],
      providers: [
        {
          provide: AclService,
          useValue: {},
        },
        {
          provide: AuthorizationService,
          useValue: {},
        },
        {
          provide: EntityManager,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AclController>(AclController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
