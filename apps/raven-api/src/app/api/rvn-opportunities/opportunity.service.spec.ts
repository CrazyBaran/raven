import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OpportunityService } from './opportunity.service';
import { OrganisationService } from './organisation.service';

describe('OpportunityService', () => {
  let service: OpportunityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpportunityService,
        {
          provide: getRepositoryToken(OpportunityEntity),
          useValue: {},
        },
        {
          provide: EntityManager,
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
          provide: getRepositoryToken(PipelineDefinitionEntity),
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
