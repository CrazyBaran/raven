import { FieldDefinitionType, TemplateTypeEnum } from '@app/rvns-templates';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { FieldDefinitionEntity } from './entities/field-definition.entity';
import { FieldGroupEntity } from './entities/field-group.entity';
import { TabEntity } from './entities/tab.entity';
import { TemplateEntity } from './entities/template.entity';
import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let mockTemplatesRepository: jest.Mocked<Partial<Repository<TemplateEntity>>>;
  let mockFieldGroupsRepository: jest.Mocked<
    Partial<Repository<FieldGroupEntity>>
  >;
  let mockTabsRepository: jest.Mocked<Partial<Repository<TabEntity>>>;
  let mockFieldDefinitionsRepository: jest.Mocked<
    Partial<Repository<FieldDefinitionEntity>>
  >;

  beforeEach(async () => {
    mockTemplatesRepository = {
      find: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    mockFieldGroupsRepository = {
      save: jest.fn(),
      remove: jest.fn(),
    };
    mockTabsRepository = {
      save: jest.fn(),
    };

    mockFieldDefinitionsRepository = {
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: getRepositoryToken(TemplateEntity),
          useValue: mockTemplatesRepository,
        },
        {
          provide: getRepositoryToken(FieldGroupEntity),
          useValue: mockFieldGroupsRepository,
        },
        {
          provide: getRepositoryToken(TabEntity),
          useValue: mockTabsRepository,
        },
        {
          provide: getRepositoryToken(FieldDefinitionEntity),
          useValue: mockFieldDefinitionsRepository,
        },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list', () => {
    it('should return a list of templates', async () => {
      const templateMock = jest.genMockFromModule<TemplateEntity>(
        './entities/template.entity',
      );
      const templates = [templateMock];
      templateMock.id = 'uuid';
      jest.spyOn(mockTemplatesRepository, 'find').mockResolvedValue(templates);

      const result = await service.list();

      expect(result).toEqual(templates);
    });
  });

  describe('createTemplate', () => {
    it('should successfully create a template', async () => {
      const name = 'New Template';
      const type = TemplateTypeEnum.Note;
      const userEntity = { id: '123', name: 'Test User' };

      const savedTemplateMock = jest.genMockFromModule<TemplateEntity>(
        './entities/template.entity',
      );
      savedTemplateMock.id = 'uuid';
      savedTemplateMock.name = name;
      savedTemplateMock.version = 1;

      jest
        .spyOn(mockTemplatesRepository, 'save')
        .mockResolvedValue(savedTemplateMock);

      const result = await service.createTemplate({
        name,
        type,
        isDefault: false,
        userEntity: userEntity as UserEntity,
      });

      expect(result).toEqual(savedTemplateMock);
    });
  });

  describe('updateTemplate', () => {
    it('should update a template', async () => {
      const templateEntityMock = jest.genMockFromModule<TemplateEntity>(
        './entities/template.entity',
      );
      const dto = { name: 'New Name' };

      const updatedTemplate = { ...templateEntityMock, name: dto.name };
      jest
        .spyOn(mockTemplatesRepository, 'save')
        .mockResolvedValue(updatedTemplate as TemplateEntity);

      const result = await service.updateTemplate(templateEntityMock, dto);

      expect(mockTemplatesRepository.save).toHaveBeenCalledWith(
        updatedTemplate,
      );
      expect(result).toEqual(updatedTemplate);
    });
  });

  describe('removeTemplate', () => {
    // TODO mock transaction manager properly
    xit('should remove a template', async () => {
      const templateEntityMock = jest.genMockFromModule<TemplateEntity>(
        './entities/template.entity',
      );

      await service.removeTemplate(templateEntityMock);

      expect(mockTemplatesRepository.remove).toHaveBeenCalledWith(
        templateEntityMock,
      );
    });
  });

  describe('createFieldGroup', () => {
    it('should create a field group', async () => {
      const options = {
        name: 'Field Group',
        order: 1,
        templateId: '1',
        tab: null,
        userEntity: { id: '123', name: 'Test User' } as UserEntity,
      };

      const savedFieldGroupMock = jest.genMockFromModule<FieldGroupEntity>(
        './entities/field-group.entity',
      );
      savedFieldGroupMock.id = 'uuid';
      savedFieldGroupMock.name = options.name;
      savedFieldGroupMock.order = options.order;
      savedFieldGroupMock.template = {
        id: options.templateId,
      } as TemplateEntity;

      jest
        .spyOn(mockFieldGroupsRepository, 'save')
        .mockResolvedValue(savedFieldGroupMock);

      const result = await service.createFieldGroup(options);

      expect(result).toEqual(savedFieldGroupMock);
    });
  });

  describe('updateFieldGroup', () => {
    it('should update a field group', async () => {
      const fieldGroupEntity = {
        id: '1',
        name: 'Old Name',
      };
      const options = { name: 'New Name' };

      const updatedFieldGroup = { ...fieldGroupEntity, name: options.name };

      jest
        .spyOn(mockFieldGroupsRepository, 'save')
        .mockResolvedValue(updatedFieldGroup as FieldGroupEntity);

      const result = await service.updateFieldGroup(
        fieldGroupEntity as FieldGroupEntity,
        options,
      );

      expect(mockFieldGroupsRepository.save).toHaveBeenCalledWith(
        updatedFieldGroup,
      );
      expect(result).toEqual(updatedFieldGroup);
    });
  });

  describe('removeFieldGroup', () => {
    it('should remove a field group', async () => {
      const fieldGroupEntity = { id: '1', name: 'Field Group' };

      jest.spyOn(mockFieldGroupsRepository, 'remove').mockReturnValue(null);

      const result = await service.removeFieldGroup(
        fieldGroupEntity as FieldGroupEntity,
      );

      expect(mockFieldGroupsRepository.remove).toHaveBeenCalledWith(
        fieldGroupEntity,
      );
      expect(result).toEqual(null);
    });
  });

  describe('createFieldDefinition', () => {
    it('should create a field definition', async () => {
      const options = {
        name: 'Field Definition',
        order: 1,
        type: FieldDefinitionType.Text,
        groupId: '1',
        userEntity: { id: '123', name: 'Test User' } as UserEntity,
      };

      const savedFieldDefinitionMock =
        jest.genMockFromModule<FieldDefinitionEntity>(
          './entities/field-definition.entity',
        );
      savedFieldDefinitionMock.id = 'uuid';
      savedFieldDefinitionMock.name = options.name;
      savedFieldDefinitionMock.order = options.order;
      savedFieldDefinitionMock.type = options.type;
      savedFieldDefinitionMock.group = {
        id: options.groupId,
      } as FieldGroupEntity;
      jest
        .spyOn(mockFieldDefinitionsRepository, 'save')
        .mockResolvedValue(savedFieldDefinitionMock);

      const result = await service.createFieldDefinition(options);

      expect(result).toEqual(savedFieldDefinitionMock);
    });
  });

  describe('updateFieldDefinition', () => {
    it('should update a field definition', async () => {
      const fieldDefinitionEntity = {
        id: '1',
        name: 'Old Definition',
        order: 1,
        type: FieldDefinitionType.Number,
      };
      const options = {
        name: 'New Definition',
        order: 2,
        type: FieldDefinitionType.Boolean,
      };

      const updatedFieldDefinition = { ...fieldDefinitionEntity, ...options };
      jest
        .spyOn(mockFieldDefinitionsRepository, 'save')
        .mockResolvedValue(updatedFieldDefinition as FieldDefinitionEntity);

      const result = await service.updateFieldDefinition(
        fieldDefinitionEntity as FieldDefinitionEntity,
        options,
      );

      expect(mockFieldDefinitionsRepository.save).toHaveBeenCalledWith(
        updatedFieldDefinition,
      );
      expect(result).toEqual(updatedFieldDefinition);
    });
  });

  describe('removeFieldDefinition', () => {
    it('should remove a field definition', async () => {
      const fieldDefinitionEntity = { id: '1', name: 'Field Definition' };

      await service.removeFieldDefinition(
        fieldDefinitionEntity as FieldDefinitionEntity,
      );

      expect(mockFieldDefinitionsRepository.remove).toHaveBeenCalledWith(
        fieldDefinitionEntity,
      );
    });
  });
});
