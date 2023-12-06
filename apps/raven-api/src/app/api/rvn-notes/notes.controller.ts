import {
  EmptyResponseData,
  GenericCreateResponseSchema,
  GenericResponseSchema,
} from '@app/rvns-api';
import {
  NoteAttachmentData,
  NoteData,
  WorkflowNoteData,
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

import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import { TemplateTypeEnum } from '@app/rvns-templates';
import { FindOrganizationByIdPipe } from '../../shared/pipes/find-organisation-by-id.pipe';
import { FindOrganizationByDomainPipe } from '../../shared/pipes/find-organization-by-domain.pipe';
import { ParseOptionalTemplateWithGroupsAndFieldsPipe } from '../../shared/pipes/parse-optional-template-with-groups-and-fields.pipe';
import { ParseTagsPipe } from '../../shared/pipes/parse-tags.pipe';
import { ShareAbility } from '../rvn-acl/casl/ability.factory';
import { ShareAction } from '../rvn-acl/enums/share-action.enum';
import { CheckShare } from '../rvn-acl/permissions/share-policy.decorator';
import {
  OrganisationTagEntity,
  TagEntity,
} from '../rvn-tags/entities/tag.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteEntity } from './entities/note.entity';
import { CompanyOpportunityTag } from './interfaces/company-opportunity-tag.interface';
import { NotesService } from './notes.service';
import { FindTagByOgranisationPipe } from './pipes/find-tag-by-ogranisation.pipe';
import { ParseCompanyOpportunityTagsPipe } from './pipes/parse-company-opportunity-tags.pipe';
import { ParseNotePipe } from './pipes/parse-note.pipe';
import { ParseSimpleNotePipe } from './pipes/parse-simple-note.pipe';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  public constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ description: 'Create note' })
  @ApiResponse(GenericCreateResponseSchema())
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOAuth2(['openid'])
  @Post()
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
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
  @ApiQuery({ name: 'organisationId', type: String, required: false })
  @ApiQuery({ name: 'type', enum: TemplateTypeEnum, required: false })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'dir', type: String, required: false })
  @ApiQuery({ name: 'field', type: String, required: false })
  @ApiQuery({ name: 'query', type: String, required: false })
  @ApiQuery({ name: 'noteType', type: String, required: false })
  @ApiQuery({ name: 'createdBy', type: String, required: false })
  @ApiQuery({ name: 'assignedTo', type: String, required: false })
  @ApiQuery({ name: 'role', type: String, required: false })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOAuth2(['openid'])
  @Get()
  public async getAllNotes(
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
    @Query('domain')
    domain: string,
    @Query('domain', FindOrganizationByDomainPipe, FindTagByOgranisationPipe)
    organisationTagFromDomain: string | OrganisationTagEntity | null, // workaround so domain passed to pipe is string
    @Query('tagIds', ParseTagsPipe)
    tagEntities: string | TagEntity[], // workaround so tagIds passed to pipe is string
    @Query('opportunityId') opportunityId: string,
    @Query('type') type: TemplateTypeEnum = TemplateTypeEnum.Note,
    @Query('organisationId') organisationId?: string,
    @Query('noteType') noteType?: string,
    @Query('createdBy') createdBy?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('role') role?: 'created' | 'tagged',
    @Query(
      'organisationId',
      FindOrganizationByIdPipe,
      FindTagByOgranisationPipe,
    )
    organisationTagFromId?: string | OrganisationTagEntity | null,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('dir') dir?: 'asc' | 'desc',
    @Query('field') field?: 'name' | 'id',
    @Query('query') query?: string,
  ): Promise<NoteData[] | (WorkflowNoteData | NoteData)[]> {
    if (opportunityId) {
      return await this.notesService.getNotesForOpportunity(
        opportunityId,
        type,
      );
    }
    if (
      (domain && organisationTagFromDomain === null) ||
      (organisationId && organisationTagFromId === null)
    ) {
      return [];
    }
    const organisation =
      (organisationTagFromDomain as OrganisationTagEntity) ||
      (organisationTagFromId as OrganisationTagEntity);
    return await Promise.all(
      (
        await this.notesService.getAllNotes(
          userEntity,
          organisation as OrganisationTagEntity,
          tagEntities as TagEntity[],
          type,
          skip,
          take,
          (dir ?? 'asc').toUpperCase() as 'ASC' | 'DESC',
          field as 'createdAt' | 'updatedAt' | 'name',
          query,
          noteType,
          createdBy,
          assignedTo,
          role,
        )
      ).map((note) => this.notesService.noteEntityToNoteData(note)),
    );
  }

  @ApiOperation({ description: 'Get single note' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'showHistory', type: Boolean, required: false })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOAuth2(['openid'])
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
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOAuth2(['openid'])
  @Get(':id/attachments')
  public async getNoteAttachments(
    @Param('id', ParseUUIDPipe, ParseSimpleNotePipe) noteEntity: NoteEntity,
  ): Promise<NoteAttachmentData[]> {
    return this.notesService.getNoteAttachments(noteEntity);
  }

  @ApiOperation({ description: 'Update note' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'noteId', type: String })
  @CheckShare((ability: ShareAbility, context) => {
    if (!context?.body['opportunityId']) {
      return true;
    }
    const can = ability.can(
      ShareAction.Edit,
      'o',
      (context.query.id as string)?.toString().toLowerCase(),
    );
  })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOAuth2(['openid'])
  @Patch(':noteId')
  public async updateNote(
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
    @Param('noteId', ParseUUIDPipe)
    noteId: string,
    @Body('companyOpportunityTags', ParseCompanyOpportunityTagsPipe)
    companyOpportunityTags: CompanyOpportunityTag[],
    @Body('tagIds', ParseTagsPipe) tags: TagEntity[],
    @Body('templateId', ParseOptionalTemplateWithGroupsAndFieldsPipe)
    templateEntity: string | TemplateEntity | null,
    @Body() dto: UpdateNoteDto,
  ): Promise<NoteData> {
    let noteEntity;
    if (!dto.origin) {
      noteEntity = await this.notesService.getNoteForUpdate(noteId);
    } else {
      noteEntity = dto.origin;
    }
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
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOAuth2(['openid'])
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
