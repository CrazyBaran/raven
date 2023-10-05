import { GenericCreateResponseSchema } from '@app/rvns-api';
import { NoteData } from '@app/rvns-notes';
import { Controller, Post, Query } from '@nestjs/common';
import {
  ApiOAuth2,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParseUserFromIdentityPipe } from '../../shared/pipes/parse-user-from-identity.pipe';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { NotesService } from './notes.service';
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

  // TODO add patch update note field and delete note
}
