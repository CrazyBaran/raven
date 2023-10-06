import {
  GenericCreateResponseSchema,
  GenericResponseSchema,
} from '@app/rvns-api';
import { NoteData, NoteFieldData } from '@app/rvns-notes';
import {
  Body,
  Controller,
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
import { UpdateNoteFieldDto } from './dto/UpdateNoteFieldDto';
import { NoteFieldGroupEntity } from './entities/note-field-group.entity';
import { NoteFieldEntity } from './entities/note-field.entity';
import { NoteEntity } from './entities/note.entity';
import { NotesService } from './notes.service';
import { ParseNoteFieldGroupPipe } from './pipes/parse-note-field-group.pipe';
import { ParseNoteFieldPipe } from './pipes/parse-note-field.pipe';
import { ParseNotePipe } from './pipes/parse-note.pipe';
import { ParseOptionalTemplateWithGroupsAndFieldsPipe } from './pipes/parse-optional-template-with-groups-and-fields.pipe';

@ApiTags('Notes')
@Controller('notes')
@ApiOAuth2(['openid'])
export class NotesController {
  public constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ description: 'Create note' })
  @ApiQuery({ name: 'templateId', type: String, required: false })
  @ApiResponse(GenericCreateResponseSchema())
  @Post()
  public async createNote(
    @Query('templateId', ParseOptionalTemplateWithGroupsAndFieldsPipe)
    templateEntity: string | TemplateEntity | null, // workaround so query parameter is passed to pipe as string
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
  ): Promise<NoteData> {
    return this.notesService.noteEntityToNoteData(
      await this.notesService.createNote(
        userEntity,
        templateEntity as TemplateEntity | null,
      ),
    );
  }

  @ApiOperation({ description: 'Get all notes' })
  @ApiResponse(GenericResponseSchema())
  @Get()
  public async getAllNotes(): Promise<NoteData[]> {
    return await Promise.all(
      (await this.notesService.getAllNotes()).map((note) =>
        this.notesService.noteEntityToNoteData(note),
      ),
    );
  }

  @ApiOperation({ description: 'Update note field' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'noteId', type: String })
  @ApiParam({ name: 'noteFieldGroupId', type: String })
  @ApiParam({ name: 'noteFieldId', type: String })
  @Patch(':noteId/fields-groups/:noteFieldGroupId/fields/:noteFieldId')
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
}
