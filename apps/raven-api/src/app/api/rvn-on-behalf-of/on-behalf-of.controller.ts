import { AccountInfo } from '@azure/msal-common';
import {
  AuthenticationResult,
  ConfidentialClientApplication,
  OnBehalfOfRequest,
} from '@azure/msal-node';
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import { Client } from '@microsoft/microsoft-graph-client';
import { User } from '@microsoft/microsoft-graph-types';
import {
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { environment } from '../../../environments/environment';
import { SharepointDirectoryStructureGenerator } from '../../shared/sharepoint-directory-structure.generator';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { ParseOrganisationPipe } from '../rvn-opportunities/pipes/parse-organisation.pipe';
import { SharepointMigrationService } from './sharepoint-migration.service';
import { GenericResponseSchema } from '@app/rvns-api';
import { MigrateSharepointDto } from './dto/migrate-sharepoint.dto';

@ApiTags('On Behalf Of Management')
@Controller('on-behalf-of')
@ApiOAuth2([environment.scopes.apiAccess])
export class OnBehalfOfController {
  public constructor(
    private readonly confidentialClientApplication: ConfidentialClientApplication,
    private readonly graphClient: Client,
    private readonly logger: RavenLogger,
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    private readonly sharepointMigrationService: SharepointMigrationService,
  ) {
    this.logger.setContext(OnBehalfOfController.name);
  }

  @Get('me')
  public async getMe(): Promise<User> {
    const response = await this.graphClient.api('/me').get();
    return response as User;
  }

  // leaving these endpoints for convenience of setting up config values
  @Get('sites')
  public async getSites(): Promise<string> {
    const response = await this.graphClient
      .api(`https://graph.microsoft.com/v1.0/sites`)
      .get();
    return response;
  }

  @Get('site-id')
  @ApiQuery({
    name: 'domain',
    type: String,
    required: true,
    description: 'e.g. testonemubadala.sharepoint.com',
  })
  @ApiQuery({
    name: 'site',
    type: String,
    required: true,
    description: 'e.g. mctestraven',
  })
  public async getSiteId(
    @Query('domain') domain: string,
    @Query('site') site: string,
  ): Promise<string> {
    const response = await this.graphClient
      .api(`https://graph.microsoft.com/v1.0/sites/${domain}:/sites/${site}`)
      .get();
    return response.id;
  }

  @Get('drives')
  @ApiQuery({
    name: 'siteId',
    type: String,
    required: true,
    description: 'can be obtained by calling GET /on-behalf-of/site-id',
  })
  public async getDriveId(@Query('siteId') siteId: string): Promise<string> {
    const response = await this.graphClient
      .api(`https://graph.microsoft.com/v1.0/sites/${siteId}/drives`)
      .get();
    return response.value;
  }

  @Get('folder-id')
  @ApiQuery({
    name: 'siteId',
    type: String,
    required: true,
    description: 'can be obtained by calling GET /on-behalf-of/site-id',
  })
  @ApiQuery({
    name: 'driveId',
    type: String,
    required: true,
    description: 'can be obtained by calling GET /on-behalf-of/drives',
  })
  @ApiQuery({
    name: 'folderName',
    type: String,
    required: true,
    description: 'name of the folder to get the id for',
  })
  public async getFolderId(
    @Query('siteId') siteId: string,
    @Query('driveId') driveId: string,
    @Query('folderName') folderName: string,
  ): Promise<string> {
    try {
      const response = await this.graphClient
        .api(
          `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${folderName}`,
        )
        .get();
      return response;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  @Patch('migrate/company-data')
  @ApiOperation({
    description: 'Migrate sharepoint organisations and opportunity ID references',
  })
  @ApiResponse(GenericResponseSchema())
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOAuth2(['openid'])
  public async migrateCompanyData(
    @Body() dto: MigrateSharepointDto,
  ): Promise<void> {
    return await this.sharepointMigrationService.migrateOrganisationsAndOpportunities(dto);
  }

  @Patch('migrate/files')
  @ApiOperation({
    description: 'Migrate sharepoint files ID references',
  })
  @ApiResponse(GenericResponseSchema())
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOAuth2(['openid'])
  public async migrateFiles(
    @Body() dto: MigrateSharepointDto,
  ): Promise<void> {
    return await this.sharepointMigrationService.migrateFiles(dto);
  }

  @Patch('migrate/check-permissions')
  @ApiOperation({
    description: 'Check if able to gather sharepoint structures.',
  })
  @ApiResponse(GenericResponseSchema())
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @ApiOAuth2(['openid'])
  public async checkPermissions(
    @Body() dto: MigrateSharepointDto,
  ): Promise<{
    currentStructureAccess: boolean,
    targetStructureAccess: boolean,
    currentFilesAccess: boolean,
    targetFilesAccess: boolean,
  }> {
    return await this.sharepointMigrationService.checkPermissions(dto);
  }

  @Get('account-info')
  public async getAllAccounts(): Promise<AccountInfo[]> {
    return await this.confidentialClientApplication
      .getTokenCache()
      .getAllAccounts();
  }
  @Get('test-hit')
  @ApiParam({
    name: 'Authorization',
    required: false,
    description: '(Leave empty. Use lock icon on the top-right to authorize)',
  })
  public async testHit(
    @Headers('Authorization') authorization: string,
  ): Promise<AuthenticationResult> {
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

    return result;
  }

  @Post('/organisation/:id/directory')
  @ApiOperation({ summary: 'Create sharepoint directory for organisation' })
  @ApiResponse({
    status: 201,
    description:
      'The organisation sharepoint directory has been successfully created.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async createFolderForOrganisation(
    @Param('id', ParseUUIDPipe, ParseOrganisationPipe)
    organisation: OrganisationEntity,
  ): Promise<string> {
    const name =
      SharepointDirectoryStructureGenerator.getDirectoryNameForOrganisation(
        organisation,
      );

    if (organisation.sharepointDirectoryId) {
      this.logger.log(`Directory ${name} already exists`);
      return organisation.sharepointDirectoryId;
    }

    const driveItem = {
      name,
      folder: {},
      '@microsoft.graph.conflictBehavior': 'fail',
    };
    const { siteId, driveId, rootDirectoryId, rootDirectory } =
      environment.sharePoint;

    let directoryId = await this.getDirectoryIdForName(name);

    if (!directoryId) {
      const res = await this.graphClient
        .api(
          `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${rootDirectoryId}/children`,
        )
        .post(driveItem);

      directoryId = res.id;
    }

    organisation.sharepointDirectoryId = directoryId;
    delete organisation.organisationDomains; // this is to avoid messing with relations
    await this.organisationRepository.save(organisation);
    return directoryId;
  }

  // TODO abstract away to service - it's duplicated from OpportunityCreatedEventHandler
  private async getDirectoryIdForName(name: string): Promise<string | null> {
    const { siteId, driveId, rootDirectory } = environment.sharePoint;
    try {
      const response = await this.graphClient
        .api(
          `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${rootDirectory}/${name}`,
        )
        .get();
      return response.id;
    } catch (e) {
      if (e.statusCode === 404) {
        return null;
      }
      this.logger.log(
        `Could not fetch directory information for name: ${name}: ${e}`,
      );
      throw e;
    }
  }
}
