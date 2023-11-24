import { GenericResponseSchema } from '@app/rvns-api';
import { FileData } from '@app/rvns-files';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParseTagsPipe } from '../../shared/pipes/parse-tags.pipe';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileEntity } from './entities/file.entity';
import { FileService } from './file.service';
import { ParseOptionalFileFromSharepointIdPipe } from './pipes/parse-optional-file-from-sharepoint-id.pipe';
import { ValidateTabTagsPipe } from './pipes/validate-tab-tags.pipe';

@ApiOAuth2(['openid'])
@ApiTags('Files')
@Controller('file')
export class FileController {
  public constructor(private readonly fileService: FileService) {}

  @Get(':opportunityId')
  public findAllForOpportunity(): void {
    console.log('temp');
  }

  @ApiOperation({ description: 'Update file tag' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'sharepointId', type: String })
  @Patch(':sharepointId')
  public async createOrUpdate(
    @Param('id', ParseUUIDPipe, ParseOptionalFileFromSharepointIdPipe)
    fileEntity: FileEntity | null,
    @Body('tagIds', ParseTagsPipe, ValidateTabTagsPipe) // TODO in future we might want to remove tag to be restricted to tab tags only
    tagEntities: TagEntity[] | null,
    @Body() updateFileDto: UpdateFileDto,
  ): Promise<FileData> {
    return this.fileService.createOrUpdate(fileEntity, { tagEntities });
  }
}
