import { FieldDefinitionType } from '@app/rvns-templates';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { OpportunityEntity } from '../rvn-opportunities/entities/opportunity.entity';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { StorageAccountService } from '../rvn-storage-account/storage-account.service';
import { ComplexTagEntity } from '../rvn-tags/entities/complex-tag.entity';
import { OrganisationTagEntity } from '../rvn-tags/entities/tag.entity';
import { FieldDefinitionEntity } from '../rvn-templates/entities/field-definition.entity';
import { FieldGroupEntity } from '../rvn-templates/entities/field-group.entity';
import { TabEntity } from '../rvn-templates/entities/tab.entity';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
import { NoteTabEntity } from './entities/note-tab.entity';
import { NoteEntity } from './entities/note.entity';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;
  let mockNoteRepository: jest.Mocked<Partial<Repository<NoteEntity>>>;
  let mockNoteFieldRepository: jest.Mocked<
    Partial<Repository<NoteFieldEntity>>
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(NoteEntity),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(OpportunityEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(OrganisationTagEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(NoteFieldEntity),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ComplexTagEntity),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: StorageAccountService,
          useValue: {},
        },
        {
          provide: RavenLogger,
          useValue: {
            setContext: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {},
        },
        {
          provide: getRepositoryToken(TemplateEntity),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    mockNoteRepository = module.get(getRepositoryToken(NoteEntity));
    mockNoteFieldRepository = module.get(getRepositoryToken(NoteFieldEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNote', () => {
    it('should create and return an empty note, when no template passed', async () => {
      const userEntity = jest.genMockFromModule<UserEntity>(
        '../rvn-users/entities/user.entity',
      );

      const noteField = new NoteFieldEntity();
      noteField.name = "Note's content";
      noteField.order = 1;
      noteField.createdBy = userEntity;
      noteField.updatedBy = userEntity;
      noteField.type = FieldDefinitionType.RichText;

      const noteFieldGroup = new NoteFieldGroupEntity();
      noteFieldGroup.name = 'New Note Group';
      noteFieldGroup.order = 1;
      noteFieldGroup.createdBy = userEntity;
      noteFieldGroup.updatedBy = userEntity;
      noteFieldGroup.noteFields = [noteField];

      const note = new NoteEntity();
      note.name = 'Note';
      note.version = 1;
      note.tags = [];
      note.createdBy = userEntity;
      note.updatedBy = userEntity;
      note.noteFieldGroups = [noteFieldGroup];

      jest.spyOn(mockNoteRepository, 'save').mockResolvedValue(note);

      const result = await service.createNote({
        name: 'Note',
        userEntity,
        templateEntity: null,
        tags: [],
        fields: [],
      });

      expect(mockNoteRepository.save).toHaveBeenCalledWith(note);
      expect(result).toBe(note);
    });
  });

  describe('filterWorkflowNote', () => {
    it('should filter tabs and fields correctly', async () => {
      const currentPipelineStageId = 'currentPipelineStageId';

      const mockPipelineStage = jest.genMockFromModule<PipelineStageEntity>(
        '../rvn-pipeline/entities/pipeline-stage.entity',
      );
      mockPipelineStage.id = currentPipelineStageId;

      const templateMock = jest.genMockFromModule<TemplateEntity>(
        '../rvn-templates/entities/template.entity',
      );
      const templateTabMock1 = jest.genMockFromModule<TabEntity>(
        '../rvn-templates/entities/tab.entity',
      );
      const templateTabMock2 = jest.genMockFromModule<TabEntity>(
        '../rvn-templates/entities/tab.entity',
      );
      const templateFieldGroupMock1 = jest.genMockFromModule<FieldGroupEntity>(
        '../rvn-templates/entities/field-group.entity',
      );
      const templateFieldMock1 = jest.genMockFromModule<FieldDefinitionEntity>(
        '../rvn-templates/entities/field-definition.entity',
      );
      const templateFieldMock2 = jest.genMockFromModule<FieldDefinitionEntity>(
        '../rvn-templates/entities/field-definition.entity',
      );

      templateFieldMock1.name = 'Test field 1';
      templateFieldMock1.id = 'fd-id-1';
      templateFieldMock2.id = 'fd-id-2';

      templateFieldMock2.name = 'Test field 2';
      templateFieldMock2.hideOnPipelineStages = [mockPipelineStage];
      templateFieldGroupMock1.fieldDefinitions = [
        templateFieldMock1,
        templateFieldMock2,
      ];
      templateTabMock1.name = 'Test tab 1';
      templateTabMock1.fieldGroups = [templateFieldGroupMock1];
      templateTabMock1.pipelineStages = [mockPipelineStage];
      templateTabMock2.name = 'Test tab 2';
      templateTabMock2.name = 'Test tab 2';
      templateMock.tabs = [templateTabMock1, templateTabMock2];

      const noteMock = jest.genMockFromModule<NoteEntity>(
        './entities/note.entity',
      );
      const tabMock1 = jest.genMockFromModule<NoteTabEntity>(
        './entities/note-tab.entity',
      );
      const tabMock2 = jest.genMockFromModule<NoteTabEntity>(
        './entities/note-tab.entity',
      );
      const fieldGroupMock1 = jest.genMockFromModule<NoteFieldGroupEntity>(
        './entities/note-field-group.entity',
      );
      const fieldMock1 = jest.genMockFromModule<NoteFieldEntity>(
        './entities/note-field.entity',
      );
      const fieldMock2 = jest.genMockFromModule<NoteFieldEntity>(
        './entities/note-field.entity',
      );

      fieldMock1.name = 'Test field 1';
      fieldMock2.name = 'Test field 2';
      fieldMock1.templateFieldId = 'fd-id-1';
      fieldMock2.templateFieldId = 'fd-id-2';
      fieldGroupMock1.noteFields = [fieldMock1, fieldMock2];
      tabMock1.name = 'Test tab 1';
      tabMock1.noteFieldGroups = [fieldGroupMock1];
      tabMock2.name = 'Test tab 2';
      noteMock.noteTabs = [tabMock1, tabMock2];
      noteMock.template = templateMock;

      const result = await service.filterWorkflowNote(
        noteMock,
        currentPipelineStageId,
      );

      const noteTabs = result.noteTabs;

      expect(noteTabs.length).toEqual(1);
      expect(noteTabs[0].name).toEqual('Test tab 1');
      expect(noteTabs[0].noteFieldGroups[0].noteFields.length).toEqual(1);
      expect(noteTabs[0].noteFieldGroups[0].noteFields[0].name).toEqual(
        'Test field 1',
      );
    });
  });
});
