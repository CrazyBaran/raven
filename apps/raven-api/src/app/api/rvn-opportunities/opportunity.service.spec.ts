import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { AffinityEnricher } from '../rvn-affinity-integration/cache/affinity.enricher';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineUtilityService } from '../rvn-pipeline/pipeline-utility.service';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OpportunityTeamService } from './opportunity-team.service';
import { OpportunityService } from './opportunity.service';
import { OrganisationService } from './organisation.service';

describe('OpportunityService', () => {
  let service: OpportunityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpportunityService,
        {
          provide: RavenLogger,
          useValue: {
            setContext: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(OpportunityEntity),
          useValue: {},
        },
        {
          provide: EntityManager,
          useValue: {},
        },
        {
          provide: AffinityEnricher,
          useValue: {},
        },
        {
          provide: AffinityCacheService,
          useValue: {},
        },
        {
          provide: OrganisationService,
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: {},
        },
        {
          provide: OpportunityTeamService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(PipelineDefinitionEntity),
          useValue: {},
        },
        {
          provide: PipelineUtilityService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OpportunityService>(OpportunityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
