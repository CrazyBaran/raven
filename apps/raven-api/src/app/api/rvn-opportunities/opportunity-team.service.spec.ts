import { Test, TestingModule } from '@nestjs/testing';
import { AclService } from '../rvn-acl/acl.service';
import { OpportunityTeamService } from './opportunity-team.service';

describe('OpportunityTeamService', () => {
  let service: OpportunityTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpportunityTeamService,
        {
          provide: AclService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OpportunityTeamService>(OpportunityTeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
