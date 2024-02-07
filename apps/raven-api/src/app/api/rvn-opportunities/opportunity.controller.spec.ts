import { ParseUUIDPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ParseTemplateWithGroupsAndFieldsPipe } from '../../shared/pipes/parse-template-with-groups-and-fields.pipe';
import { FilesService } from '../rvn-files/files.service';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { OrganisationEntity } from './entities/organisation.entity';
import { OpportunityTeamService } from './opportunity-team.service';
import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';
import { ParseGetOrganisationsOptionsPipe } from './pipes/parse-get-organisations-options.pipe';

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
        {
          provide: getRepositoryToken(OrganisationEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TemplateEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: ParseUUIDPipe,
          useValue: {},
        },
        {
          provide: ParseTemplateWithGroupsAndFieldsPipe,
          useValue: {},
        },
        {
          provide: EntityManager,
          useValue: {},
        },
        {
          provide: FilesService,
          useValue: {},
        },
        {
          provide: OpportunityTeamService,
          useValue: {},
        },
        {
          provide: ParseGetOrganisationsOptionsPipe,
          useValue: {},
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
      expect(await controller.findAll(0, 10)).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single opportunity', async () => {
      const result = { id: 'testId' };
      mockService.findOne.mockReturnValue(result);
      expect(await controller.findOne('testId')).toBe(result);
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
