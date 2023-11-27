import { GenericResponseSchema } from '@app/rvns-api';
import { FileData } from '@app/rvns-files';
import {
  ConfidentialClientApplication,
  OnBehalfOfRequest,
} from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';
import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  Headers,
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
import { environment } from '../../../environments/environment';
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
  public constructor(
    private readonly fileService: FileService,
    private readonly httpService: HttpService,
    private readonly confidentialClientApplication: ConfidentialClientApplication,
  ) {}

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

  @Get('test-hit')
  public async testHit(
    @Headers('Authorization') authorization: string,
  ): Promise<void> {
    const access_token = authorization.split(' ')[1];
    const oboRequest: OnBehalfOfRequest = {
      oboAssertion: access_token,
      scopes: ['openid'],
      authority: environment.azureAd.authority,
    } as OnBehalfOfRequest;
    const result =
      await this.confidentialClientApplication.acquireTokenOnBehalfOf(
        oboRequest,
      );

    const client = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: () => Promise.resolve(result.accessToken),
      },
    });

    const apiUrl = 'https://testonemubadala.sharepoint.com/';

    client.api(apiUrl).get((err, res) => {
      console.log({ err, res });
    });

    const response = await this.httpService
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${result.accessToken}`,
        },
      })
      .toPromise();
    console.log({ response });
  }
}
