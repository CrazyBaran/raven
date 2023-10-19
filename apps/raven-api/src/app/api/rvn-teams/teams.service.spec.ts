import { EntityManager } from 'typeorm';

import { Test } from '@nestjs/testing';
import { AclService } from '../rvn-acl/acl.service';
import { TeamsService } from './teams.service';

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: EntityManager,
          useValue: {},
        },
        {
          provide: AclService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
