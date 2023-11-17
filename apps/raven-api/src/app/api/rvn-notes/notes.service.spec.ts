import { FieldDefinitionType } from '@app/rvns-templates';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { OpportunityEntity } from '../rvn-opportunities/entities/opportunity.entity';
import { StorageAccountService } from '../rvn-storage-account/storage-account.service';
import { OrganisationTagEntity } from '../rvn-tags/entities/tag.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
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
});
