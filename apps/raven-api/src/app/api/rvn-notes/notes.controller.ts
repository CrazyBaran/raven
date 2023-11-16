import {
  EmptyResponseData,
  GenericCreateResponseSchema,
  GenericResponseSchema,
} from '@app/rvns-api';
import {
  NoteAttachmentData,
  NoteData,
  NoteFieldData,
  NoteWithRelatedNotesData,
} from '@app/rvns-notes/data-access';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParseUserFromIdentityPipe } from '../../shared/pipes/parse-user-from-identity.pipe';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { UserEntity } from '../rvn-users/entities/user.entity';

import { TemplateTypeEnum } from '@app/rvns-templates';
import { FindOrganizationByDomainPipe } from '../../shared/pipes/find-organization-by-domain.pipe';
import {
  OrganisationTagEntity,
  TagEntity,
} from '../rvn-tags/entities/tag.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteFieldDto } from './dto/update-note-field.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
import { NoteEntity } from './entities/note.entity';
import { CompanyOpportunityTag } from './interfaces/company-opportunity-tag.interface';
import { NotesService } from './notes.service';
import { FindTagByOgranisationPipe } from './pipes/find-tag-by-ogranisation.pipe';
import { ParseCompanyOpportunityTagsPipe } from './pipes/parse-company-opportunity-tags.pipe';
import { ParseNoteFieldGroupPipe } from './pipes/parse-note-field-group.pipe';
import { ParseNoteFieldPipe } from './pipes/parse-note-field.pipe';
import { ParseNotePipe } from './pipes/parse-note.pipe';
import { ParseOptionalTemplateWithGroupsAndFieldsPipe } from './pipes/parse-optional-template-with-groups-and-fields.pipe';
import { ParseTagsPipe } from './pipes/parse-tags.pipe';

@ApiTags('Notes')
@Controller('notes')
@ApiOAuth2(['openid'])
export class NotesController {
  public constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ description: 'Create note' })
  @ApiResponse(GenericCreateResponseSchema())
  @Post()
  public async createNote(
    @Body('templateId', ParseOptionalTemplateWithGroupsAndFieldsPipe)
    templateEntity: string | TemplateEntity | null,
    @Body('tagIds', ParseTagsPipe) tags: TagEntity[],
    @Body('companyOpportunityTags', ParseCompanyOpportunityTagsPipe)
    companyOpportunityTags: CompanyOpportunityTag[],
    @Body() dto: CreateNoteDto,
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
  ): Promise<NoteData> {
    return this.notesService.noteEntityToNoteData(
      await this.notesService.createNote({
        name: dto.name,
        userEntity,
        templateEntity: templateEntity as TemplateEntity,
        tags,
        fields: dto.fields,
        rootVersionId: dto.rootVersionId?.toLowerCase(),
        companyOpportunityTags,
      }),
    );
  }

  @ApiOperation({ description: 'Get all notes' })
  @ApiResponse(GenericResponseSchema())
  @ApiQuery({ name: 'domain', type: String, required: false })
  @ApiQuery({ name: 'opportunityId', type: String, required: false })
  @ApiQuery({ name: 'type', enum: TemplateTypeEnum, required: false })
  @ApiQuery({
    name: 'tagIds',
    type: String,
    required: false,
    description: 'Comma separated list of tag ids',
  })
  @Get()
  public async getAllNotes(
    @Query('domain')
    domain: string,
    @Query('domain', FindOrganizationByDomainPipe, FindTagByOgranisationPipe)
    organisationTagEntity: string | OrganisationTagEntity | null, // workaround so domain passed to pipe is string
    @Query('tagIds', ParseTagsPipe)
    tagEntities: string | TagEntity[], // workaround so tagIds passed to pipe is string

    @Query('opportunityId') opportunityId: string,
    @Query('type') type: TemplateTypeEnum = TemplateTypeEnum.Note,
  ): Promise<NoteData[] | (NoteWithRelatedNotesData | NoteData)[]> {
    if (opportunityId) {
      return await this.notesService.getNotesForOpportunity(opportunityId);
    }
    if (domain && organisationTagEntity === null) {
      return [];
    }
    return await Promise.all(
      (
        await this.notesService.getAllNotes(
          organisationTagEntity as OrganisationTagEntity,
          tagEntities as TagEntity[],
          type,
        )
      ).map((note) => this.notesService.noteEntityToNoteData(note)),
    );
  }

  @ApiOperation({ description: 'Get single note' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'showHistory', type: Boolean, required: false })
  @Get(':id')
  public async getNote(
    @Param('id', ParseUUIDPipe, ParseNotePipe) noteEntity: NoteEntity,
    @Query('showHistory') showHistory: boolean,
  ): Promise<NoteData | NoteData[]> {
    if (showHistory) {
      const noteEntities =
        await this.notesService.getAllNoteVersions(noteEntity);
      return noteEntities.map((noteEntity) =>
        this.notesService.noteEntityToNoteData(noteEntity),
      );
    }
    return this.notesService.noteEntityToNoteData(noteEntity);
  }

  @ApiOperation({ description: 'Get note attachments' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'showHistory', type: Boolean, required: false })
  @Get(':id/attachments')
  public async getNoteAttachments(
    @Param('id', ParseUUIDPipe, ParseNotePipe) noteEntity: NoteEntity,
  ): Promise<NoteAttachmentData[]> {
    return this.notesService.getNoteAttachments(noteEntity);
  }

  @ApiOperation({
    description:
      'Update note field. Deprecated - bulk update to be used in order to maintain correct note versioning.',
    deprecated: true,
  })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'noteId', type: String })
  @ApiParam({ name: 'noteFieldGroupId', type: String })
  @ApiParam({ name: 'noteFieldId', type: String })
  @Put(':noteId/fields-groups/:noteFieldGroupId/fields/:noteFieldId')
  public async updateNoteField(
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
    @Param('noteId', ParseUUIDPipe, ParseNotePipe) noteEntity: NoteEntity,
    @Param('noteFieldGroupId', ParseUUIDPipe, ParseNoteFieldGroupPipe)
    noteFieldGroupEntity: NoteFieldGroupEntity,
    @Param('noteFieldId', ParseUUIDPipe, ParseNoteFieldPipe)
    noteFieldEntity: NoteFieldEntity,
    @Body() dto: UpdateNoteFieldDto,
  ): Promise<NoteFieldData> {
    return this.notesService.noteFieldEntityToNoteFieldData(
      await this.notesService.updateNoteField(
        noteFieldEntity,
        { value: dto.value },
        userEntity,
      ),
    );
  }

  @ApiOperation({ description: 'Update note' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'noteId', type: String })
  @Patch(':noteId')
  public async updateNote(
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
    @Param('noteId', ParseUUIDPipe, ParseNotePipe) noteEntity: NoteEntity,
    @Body('companyOpportunityTags', ParseCompanyOpportunityTagsPipe)
    companyOpportunityTags: CompanyOpportunityTag[],
    @Body('tagIds', ParseTagsPipe) tags: TagEntity[],
    @Body('templateId', ParseOptionalTemplateWithGroupsAndFieldsPipe)
    templateEntity: string | TemplateEntity | null,
    @Body() dto: UpdateNoteDto,
  ): Promise<NoteData> {
    return this.notesService.noteEntityToNoteData(
      await this.notesService.updateNote(noteEntity, userEntity, {
        tags,
        companyOpportunityTags,
        fields: dto.fields,
        name: dto.name,
        templateEntity: templateEntity as TemplateEntity,
      }),
    );
  }

  @ApiOperation({ description: 'Delete note' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'noteId', type: String })
  @Delete(':noteId')
  public async deleteNote(
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
    @Param('noteId', ParseUUIDPipe, ParseNotePipe)
    noteEntity: NoteEntity,
  ): Promise<EmptyResponseData> {
    const noteEntities = await this.notesService.getAllNoteVersions(noteEntity);
    if (noteEntity.createdById !== userEntity.id) {
      throw new ForbiddenException('Note can be deleted only by its creator.');
    }
    return await this.notesService.deleteNotes(noteEntities, userEntity);
  }
}
