import {
  EmptyResponseData,
  GenericCreateResponseSchema,
  GenericResponseSchema,
} from '@app/rvns-api';
import { NoteData, NoteFieldData } from '@app/rvns-notes/data-access';
import {
  Body,
  Controller,
  Delete,
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

import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteFieldDto } from './dto/update-note-field.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
import { NoteEntity } from './entities/note.entity';
import { NotesService } from './notes.service';
import { ParseAllNoteVersionsPipe } from './pipes/parse-all-note-versions.pipe';
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
    templateEntity: TemplateEntity | null,
    @Body('tagIds', ParseTagsPipe) tags: TagEntity[],
    @Body() dto: CreateNoteDto,
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
  ): Promise<NoteData> {
    return this.notesService.noteEntityToNoteData(
      await this.notesService.createNote({
        name: dto.name,
        userEntity,
        templateEntity,
        tags,
      }),
    );
  }

  @ApiOperation({ description: 'Get all notes' })
  @ApiResponse(GenericResponseSchema())
  @Get()
  public async getAllNotes(): Promise<NoteData[]> {
    // TODO filtering byu domain will be handled with tags - there is no longer relation between note and opportunity
    return await Promise.all(
      (await this.notesService.getAllNotes()).map((note) =>
        this.notesService.noteEntityToNoteData(note),
      ),
    );
  }

  @ApiOperation({ description: 'Get single notes' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'showHistory', type: Boolean, required: false })
  @Get(':id')
  public async getNote(
    @Param('id', ParseUUIDPipe, ParseNotePipe) noteEntity: NoteEntity,
    @Param('id', ParseUUIDPipe, ParseAllNoteVersionsPipe)
    noteEntites: NoteEntity[],
    @Query('showHistory') showHistory: boolean,
  ): Promise<NoteData | NoteData[]> {
    if (showHistory) {
      return noteEntites.map((noteEntity) =>
        this.notesService.noteEntityToNoteData(noteEntity),
      );
    }
    return this.notesService.noteEntityToNoteData(noteEntity);
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
    @Body('tagIds', ParseTagsPipe) tags: TagEntity[],
    @Body() dto: UpdateNoteDto,
  ): Promise<NoteData> {
    return this.notesService.noteEntityToNoteData(
      await this.notesService.updateNote(noteEntity, userEntity, {
        tags,
        fields: dto.fields,
      }),
    );
  }

  @ApiOperation({ description: 'Delete note' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'noteId', type: String })
  @Delete(':noteId')
  public async deleteNote(
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
    @Param('noteId', ParseUUIDPipe, ParseNotePipe) noteEntity: NoteEntity,
  ): Promise<EmptyResponseData> {
    // TODO delete all versions...
    return await this.notesService.deleteNote(noteEntity, userEntity);
  }
}
