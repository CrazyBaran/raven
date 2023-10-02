import { Test, TestingModule } from '@nestjs/testing';
import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';
import { Opportunity } from './entities/opportunity.entity';

describe('OpportunityController', () => {
  let controller: OpportunityController;
  let mockService;

  beforeEach(async () => {
    mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpportunityController],
      providers: [
        {
          provide: OpportunityService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OpportunityController>(OpportunityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of opportunities', async () => {
      const result = [];
      mockService.findAll.mockReturnValue(result);
      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single opportunity', async () => {
      const result = { id: 'testId' };
      mockService.findOne.mockReturnValue(result);
      expect(await controller.findOne('testId')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return an opportunity', async () => {
      const opportunity = { id: 'testId' } as Opportunity;
      mockService.create.mockReturnValue(opportunity);
      expect(await controller.create(opportunity)).toBe(opportunity);
    });
  });

  describe('update', () => {
    it('should update and return the updated opportunity', async () => {
      const opportunity = { id: 'testId' } as Opportunity;
      mockService.update.mockReturnValue({});
      await controller.update('testId', opportunity);
      expect(mockService.update).toHaveBeenCalledWith('testId', opportunity);
    });
  });

  describe('remove', () => {
    it('should delete the opportunity', async () => {
      mockService.remove.mockReturnValue({});
      await controller.remove('testId');
      expect(mockService.remove).toHaveBeenCalledWith('testId');
    });
  });
});
