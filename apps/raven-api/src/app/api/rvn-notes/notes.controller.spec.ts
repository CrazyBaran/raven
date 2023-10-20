import { ParseUUIDPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { FindOrganizationByDomainPipe } from '../../shared/pipes/find-organization-by-domain.pipe';
import { ParseTemplateWithGroupsAndFieldsPipe } from '../../shared/pipes/parse-template-with-groups-and-fields.pipe';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { NoteEntity } from './entities/note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

describe('NotesController', () => {
  let controller: NotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        { provide: NotesService, useValue: {} },
        { provide: EntityManager, useValue: {} },
        { provide: ParseUUIDPipe, useValue: {} },
        { provide: ParseTemplateWithGroupsAndFieldsPipe, useValue: {} },
        { provide: FindOrganizationByDomainPipe, useValue: {} },
        {
          provide: getRepositoryToken(NoteEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(OrganisationEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TagEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
