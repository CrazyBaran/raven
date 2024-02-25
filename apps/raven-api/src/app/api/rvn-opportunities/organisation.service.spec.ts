import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { AffinityEnricher } from '../rvn-affinity-integration/cache/affinity.enricher';
import { OrganizationStageDto } from '../rvn-affinity-integration/dtos/organisation-stage.dto';
import { DataWarehouseEnricher } from '../rvn-data-warehouse/cache/data-warehouse.enricher';
import { OrganisationProvider } from '../rvn-data-warehouse/proxy/organisation.provider';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineUtilityService } from '../rvn-pipeline/pipeline-utility.service';
import { ShortlistsService } from '../rvn-shortlists/shortlists.service';
import { DomainResolver } from '../rvn-utils/domain.resolver';
import { OrganisationEntity } from './entities/organisation.entity';
import { OpportunityTeamService } from './opportunity-team.service';
import { OrganisationService } from './organisation.service';

describe('OrganisationService', () => {
  let service: OrganisationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganisationService,
        {
          provide: getRepositoryToken(OrganisationEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PipelineDefinitionEntity),
          useValue: {},
        },
        {
          provide: AffinityCacheService,
          useValue: {},
        },
        {
          provide: AffinityEnricher,
          useValue: {},
        },
        {
          provide: DataWarehouseEnricher,
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
        {
          provide: OpportunityTeamService,
          useValue: {},
        },
        {
          provide: DomainResolver,
          useValue: {},
        },
        {
          provide: PipelineUtilityService,
          useValue: {},
        },
        {
          provide: ShortlistsService,
          useValue: {},
        },
        {
          provide: OrganisationProvider,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrganisationService>(OrganisationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getNonExistentAffinityData should return nonexistent entries - case all are existing', () => {
    const afOrg1 = jest.genMockFromModule<OrganizationStageDto>(
      '../rvn-affinity-integration/dtos/organisation-stage.dto',
    );
    afOrg1.organizationDto = {
      id: 1,
      name: 'test name',
      domain: 'test-domain.com',
      domains: ['test-domain.pl', 'test-domain.com'],
      global: true,
    };
    const affinityData: OrganizationStageDto[] = [afOrg1];
    const organisation1 = jest.genMockFromModule<OrganisationEntity>(
      './entities/organisation.entity',
    );
    organisation1.domains = ['test-domain.com'];
    const existingOrganisations: OrganisationEntity[] = [organisation1];

    const result = service.getNonExistentAffinityData(
      affinityData,
      existingOrganisations,
    );

    expect(result).toEqual([]);
  });
  it('getNonExistentAffinityData should return nonexistent entries - case some domains are not existing, but some are', () => {
    const afOrg1 = jest.genMockFromModule<OrganizationStageDto>(
      '../rvn-affinity-integration/dtos/organisation-stage.dto',
    );
    afOrg1.organizationDto = {
      id: 1,
      name: 'test name',
      domain: 'nonexistiant-main.com',
      domains: ['nonexistiant-main.com', 'test-domain.com'],
      global: true,
    };

    const affinityData: OrganizationStageDto[] = [afOrg1];
    const organisation1 = jest.genMockFromModule<OrganisationEntity>(
      './entities/organisation.entity',
    );
    organisation1.domains = ['test-domain.com'];
    const existingOrganisations: OrganisationEntity[] = [organisation1];

    const result = service.getNonExistentAffinityData(
      affinityData,
      existingOrganisations,
    );

    expect(result).toEqual([]);
  });
  it('getNonExistentAffinityData should return nonexistent entries - case none of domains exist', () => {
    const afOrg1 = jest.genMockFromModule<OrganizationStageDto>(
      '../rvn-affinity-integration/dtos/organisation-stage.dto',
    );
    afOrg1.organizationDto = {
      id: 1,
      name: 'test name',
      domain: 'nonexistiant-main.com',
      domains: ['nonexistiant-main.com', 'and-another-one.com'],
      global: true,
    };

    const affinityData: OrganizationStageDto[] = [afOrg1];
    const organisation1 = jest.genMockFromModule<OrganisationEntity>(
      './entities/organisation.entity',
    );
    organisation1.domains = ['test-domain.com'];
    const existingOrganisations: OrganisationEntity[] = [organisation1];

    const result = service.getNonExistentAffinityData(
      affinityData,
      existingOrganisations,
    );

    expect(result).toEqual([afOrg1]);
  });
});
