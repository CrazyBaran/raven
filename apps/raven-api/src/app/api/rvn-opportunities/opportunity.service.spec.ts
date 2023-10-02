import { Test, TestingModule } from '@nestjs/testing';
import { OpportunityService } from './opportunity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OpportunityEntity } from './entities/opportunity.entity';

describe('OpportunityService', () => {
  let service: OpportunityService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpportunityService,
        {
          provide: getRepositoryToken(OpportunityEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OpportunityService>(OpportunityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of opportunities', async () => {
      const result = [];
      mockRepository.find.mockReturnValue(result);
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single opportunity', async () => {
      const result = { id: 'testId' };
      mockRepository.findOne.mockReturnValue(result);
      expect(await service.findOne('testId')).toBe(result);
    });
  });

  describe('create', () => {
    it('should successfully insert an opportunity', async () => {
      const opportunity = { id: 'testId' } as OpportunityEntity;
      mockRepository.save.mockReturnValue(opportunity);
      expect(await service.create(opportunity)).toBe(opportunity);
    });
  });

  describe('update', () => {
    it('should successfully update an opportunity', async () => {
      const opportunity = { id: 'testId' } as OpportunityEntity;
      mockRepository.update.mockReturnValue({});
      await service.update('testId', opportunity);
      expect(mockRepository.update).toHaveBeenCalledWith('testId', opportunity);
    });
  });

  describe('remove', () => {
    it('should successfully delete an opportunity', async () => {
      mockRepository.delete.mockReturnValue({});
      await service.remove('testId');
      expect(mockRepository.delete).toHaveBeenCalledWith('testId');
    });
  });
});
