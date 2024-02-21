import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { AFFINITY_CACHE, AFFINITY_FIELDS_CACHE } from '../affinity.const';
import { FieldValueRankedDropdownDto } from '../api/dtos/field-value-ranked-dropdown.dto';
import { FieldDto } from '../api/dtos/field.dto';
import { EntityType } from '../api/dtos/list-type.dto';
import { OrganizationDto } from '../api/dtos/organization.dto';
import { OrganizationStageDto } from '../dtos/organisation-stage.dto';
import { AffinityCacheService } from './affinity-cache.service';

const organisationStageDtos = [
  {
    organizationDto: {
      id: 123,
      type: EntityType.Organization,
      name: 'Organisation 1',
      domain: 'first-test.com',
      domains: ['first-test.com'],
      global: true,
    } as OrganizationDto,
    entityId: 456,
    listEntryId: 789,
    entryAdded: new Date(),
    stage: {} as FieldValueRankedDropdownDto,
    fields: [
      {
        displayName: 'test',

        value: 'test',
      },
    ],
  } as OrganizationStageDto,
  {
    organizationDto: {
      id: 124,
      type: EntityType.Organization,
      name: 'Organisation 2',
      domain: 'test.com',
      domains: ['test.com', 'test.co.uk'],
      global: true,
    } as OrganizationDto,
    entityId: 456,
    listEntryId: 789,
    entryAdded: new Date(),
    stage: {} as FieldValueRankedDropdownDto,
    fields: [
      {
        displayName: 'test',
        value: 'test',
      },
    ],
  } as OrganizationStageDto,
];

const fields = [{ id: 1, name: 'test' } as FieldDto];

describe('AffinityCacheService', () => {
  let service: AffinityCacheService;
  let mockCacheManager;
  let mockPipeline;
  beforeEach(async () => {
    mockPipeline = {
      hset: jest.fn(),
      exec: jest.fn(),
    };
    mockCacheManager = {
      store: {
        client: {
          pipeline: jest.fn().mockReturnValue(mockPipeline),
          hgetall: jest.fn(),
          hget: jest.fn(),
          hmget: jest.fn(),
          exists: jest.fn((redisKey) => redisKey === AFFINITY_CACHE),
          del: jest.fn(),
          hkeys: jest.fn(),
          hset: jest.fn(),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AffinityCacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<AffinityCacheService>(AffinityCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add or replace many', async () => {
    const client = mockCacheManager.store.client;

    await service.addOrReplaceMany(organisationStageDtos);
    expect(client.hset).toHaveBeenCalledTimes(1);
    expect(client.hset).toHaveBeenCalledWith(AFFINITY_CACHE, {
      'first-test.com': JSON.stringify(organisationStageDtos[0]),
      'test.com,test.co.uk': JSON.stringify(organisationStageDtos[1]),
    });
  });

  it('should get all', async () => {
    const rawData = {
      'first-test.com': JSON.stringify(organisationStageDtos[0]),
      'test.com,test.co.uk': JSON.stringify(organisationStageDtos[1]),
    };
    mockCacheManager.store.client.hgetall.mockResolvedValue(rawData);

    const result = await service.getAll();
    expect(result).toEqual(organisationStageDtos);
  });

  it('should get all with filters', async () => {
    const rawData = {
      'first-test.com': JSON.stringify(organisationStageDtos[0]),
      'test.com,test.co.uk': JSON.stringify(organisationStageDtos[1]),
    };
    mockCacheManager.store.client.hgetall.mockResolvedValue(rawData);

    const result = await service.getAll(
      (data) => data.organizationDto.id === 123,
    );
    expect(result).toEqual([organisationStageDtos[0]]);
  });

  it('should get by domains', async () => {
    const rawData = {
      'first-test.com': JSON.stringify(organisationStageDtos[0]),
      'test.com,test.co.uk': JSON.stringify(organisationStageDtos[1]),
    };
    mockCacheManager.store.client.hkeys.mockResolvedValue(Object.keys(rawData));
    mockCacheManager.store.client.hmget.mockResolvedValue([
      JSON.stringify(organisationStageDtos[1]),
    ]);

    const result = await service.getByDomains(['test.co.uk']);
    expect(result).toEqual([organisationStageDtos[1]]);
    expect(mockCacheManager.store.client.hmget).toHaveBeenCalledWith(
      AFFINITY_CACHE,
      ...['test.com,test.co.uk'],
    );
  });

  it('should get many by domains', async () => {
    const rawData = {
      'first-test.com': JSON.stringify(organisationStageDtos[0]),
      'test.com,test.co.uk': JSON.stringify(organisationStageDtos[1]),
    };

    mockCacheManager.store.client.hkeys.mockResolvedValue(Object.keys(rawData));
    mockCacheManager.store.client.hmget.mockResolvedValue([
      JSON.stringify(organisationStageDtos[0]),
      JSON.stringify(organisationStageDtos[1]),
    ]);

    const result = await service.getByDomains(['test.co.uk', 'first-test.com']);
    expect(result).toContainEqual(organisationStageDtos[1]);
    expect(result).toContainEqual(organisationStageDtos[0]);
    expect(mockCacheManager.store.client.hmget).toHaveBeenCalledWith(
      AFFINITY_CACHE,
      ...['first-test.com', 'test.com,test.co.uk'],
    );
  });

  it('should reset', async () => {
    await service.reset();
    expect(mockCacheManager.store.client.del).toHaveBeenCalledWith(
      AFFINITY_CACHE,
    );
  });

  it('should set list fields', async () => {
    const pipeline = mockCacheManager.store.client.pipeline;

    await service.setListFields(fields);
    expect(pipeline().hset).toHaveBeenCalledWith(
      AFFINITY_FIELDS_CACHE,
      'test',
      JSON.stringify(fields[0]),
    );
  });

  it('should get list fields', async () => {
    mockCacheManager.store.client.hgetall.mockResolvedValue({
      test: JSON.stringify(fields[0]),
    });
    const result = await service.getListFields();
    expect(result).toEqual(fields);
  });

  it('should return empty array if no fields are found', async () => {
    mockCacheManager.store.client.hgetall.mockResolvedValue({});
    const result = await service.getListFields();
    expect(result).toEqual([]);
  });

  it('should return empty array if no matching keys are found', async () => {
    mockCacheManager.store.client.hkeys.mockResolvedValue([]);

    const result = await service.getByDomains(['test.co.uk']);
    expect(result).toEqual([]);
    expect(mockCacheManager.store.client.hmget).not.toHaveBeenCalled();
  });

  it('should return only one item, if try get by two domains', async () => {
    const rawData = {
      'first-test.com': JSON.stringify(organisationStageDtos[0]),
    };

    mockCacheManager.store.client.hkeys.mockResolvedValue(Object.keys(rawData));
    mockCacheManager.store.client.hmget.mockResolvedValue([
      JSON.stringify(organisationStageDtos[0]),
    ]);

    const result = await service.getByDomains(['test.co.uk', 'first-test.com']);
    expect(result).toContainEqual(organisationStageDtos[0]);
    expect(result).toHaveLength(1);
    expect(mockCacheManager.store.client.hmget).toHaveBeenCalledWith(
      AFFINITY_CACHE,
      ...['first-test.com'],
    );
  });
});
