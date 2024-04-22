import { ShareRole } from '@app/rvns-acl';
import { GenericResponseSchema } from '@app/rvns-api';
import { FileData } from '@app/rvns-files';
import {
  OpportunityData,
  OpportunityTeamData,
  PagedOpportunityData,
} from '@app/rvns-opportunities';
import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsArray, IsDefined } from 'class-validator';
import { FindOrganizationByDomainPipe } from '../../shared/pipes/find-organization-by-domain.pipe';
import { ParseTagsPipe } from '../../shared/pipes/parse-tags.pipe';
import { ParseUserFromIdentityPipe } from '../../shared/pipes/parse-user-from-identity.pipe';
import { ShareAbility } from '../rvn-acl/casl/ability.factory';
import { ShareAction } from '../rvn-acl/enums/share-action.enum';
import { CheckShare } from '../rvn-acl/permissions/share-policy.decorator';
import { UpdateFileDto } from '../rvn-files/dto/update-file.dto';
import { FileEntity } from '../rvn-files/entities/file.entity';
import { FilesService } from '../rvn-files/files.service';
import { ParseOptionalFileFromSharepointIdPipe } from '../rvn-files/pipes/parse-optional-file-from-sharepoint-id.pipe';
import { ValidateTabTagsPipe } from '../rvn-files/pipes/validate-tab-tags.pipe';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { ParseUserPipe } from '../rvn-users/pipes/parse-user.pipe';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';
import { OpportunityTeamService } from './opportunity-team.service';
import { OpportunityService } from './opportunity.service';
import { ParseOpportunityPipe } from './pipes/parse-opportunity.pipe';
import { ParseOptionalOrganisationPipe } from './pipes/parse-optional-organisation.pipe';
import { ParseOptionalPipelineStagePipe } from './pipes/parse-optional-pipeline-stage.pipe';
import { ParseOptionalTagPipe } from './pipes/parse-optional-tag.pipe';
import { ValidateOpportunityTagPipe } from './pipes/validate-opportunity-tag.pipe';

export class CreateOrUpdateTeamDto {
  @ApiProperty()
  @IsDefined()
  @IsArray()
  public readonly members: string[];
  @ApiProperty()
  @IsDefined()
  @IsArray()
  public readonly owners: string[];
}

@ApiTags('Opportunities')
@Controller('opportunities')
export class OpportunityController {
  public constructor(
    private readonly opportunityService: OpportunityService,
    private readonly opportunityTeamService: OpportunityTeamService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all opportunities' })
  @ApiResponse({ status: 200, description: 'List of opportunities' })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'pipelineStageId', type: String, required: false })
  @ApiQuery({ name: 'domain', type: String, required: false })
  @ApiQuery({ name: 'dir', type: String, required: false })
  @ApiQuery({ name: 'field', type: String, required: false })
  @ApiQuery({ name: 'query', type: String, required: false })
  @ApiQuery({ name: 'member', type: String, required: false })
  @ApiQuery({ name: 'round', type: String, required: false })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('domain') domain?: string,
    @Query('pipelineStageId') pipelineStageId?: string,
    @Query('dir') dir?: string,
    @Query('field') field?: string,
    @Query('query') query?: string,
    @Query('member') member?: string,
    @Query('round') round?: string,
  ): Promise<PagedOpportunityData> {
    if (domain) {
      return await this.opportunityService.findByDomain(domain, {
        skip: skip ?? 0,
        take: take ?? 5,
      });
    } else {
      const options = {
        skip: skip ?? 0,
        take: take ?? 10,
        dir: (dir ?? 'asc').toUpperCase() as 'ASC' | 'DESC',
        field: field ?? 'createdAt',
        pipelineStageId: pipelineStageId ?? null,
        query: query ?? '',
        member: member ?? null,
        round: round ?? null,
      };

      return await this.opportunityService.findAll(options);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single opportunity' })
  @ApiResponse({ status: 200, description: 'The opportunity details' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public findOne(@Param('id') id: string): Promise<OpportunityData> {
    return this.opportunityService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new opportunity',
  })
  @ApiResponse({
    status: 201,
    description: 'The opportunity has been successfully created.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async create(
    @Body() dto: CreateOpportunityDto,
    @Body('domain', FindOrganizationByDomainPipe)
    organisationFromDomain: string | OrganisationEntity | null,
    @Body('organisationId', ParseOptionalOrganisationPipe)
    organisationFromId: string | OrganisationEntity | null,
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
  ): Promise<OpportunityData> {
    const organisation =
      (organisationFromDomain as OrganisationEntity) ||
      (organisationFromId as OrganisationEntity);
    if (organisation) {
      return this.opportunityService.opportunityEntityToData(
        await this.opportunityService.createFromOrganisation({
          organisation,
          userEntity,
        }),
      );
    } else {
      return this.opportunityService.opportunityEntityToData(
        await this.opportunityService.createForNonExistingOrganisation({
          name: dto.name,
          domain: dto.domain,
          userEntity,
        }),
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an opportunity' })
  @ApiResponse({
    status: 200,
    description: 'The opportunity has been successfully updated.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async update(
    @Param('id', ParseUUIDPipe, ParseOpportunityPipe)
    opportunity: OpportunityEntity,
    @Body() dto: UpdateOpportunityDto,
    @Body('pipelineStageId', ParseOptionalPipelineStagePipe)
    pipelineStage: string | PipelineStageEntity | null,
    @Body('opportunityTagId', ParseOptionalTagPipe, ValidateOpportunityTagPipe)
    tag: string | TagEntity | null,
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
  ): Promise<OpportunityData> {
    if (dto.duplicateAndReopen) {
      return this.opportunityService.opportunityEntityToData(
        await this.opportunityService.duplicateAndReopen(
          opportunity,
          userEntity,
          dto.versionName,
        ),
      );
    }

    return this.opportunityService.opportunityEntityToData(
      await this.opportunityService.update(
        opportunity,
        {
          ...dto,
          pipelineStage: pipelineStage as PipelineStageEntity,
          tagEntity: tag as TagEntity,
        },
        userEntity,
      ),
    );
  }

  @ApiOperation({ description: 'Update file tags' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'opportunityId', type: String })
  @ApiParam({ name: 'sharepointId', type: String })
  @Patch(':opportunityId/files/:sharepointId')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async createOrUpdate(
    @Param('sharepointId', ParseOptionalFileFromSharepointIdPipe)
    fileEntity: FileEntity | null,
    @Param('sharepointId') sharepointId: string,
    @Param('opportunityId') opportunityId: string,
    @Body('tagIds', ParseTagsPipe, ValidateTabTagsPipe) // TODO in future we might want to remove tag to be restricted to tab tags only
    tagEntities: TagEntity[] | null,
    @Body() updateFileDto: UpdateFileDto,
  ): Promise<FileData> {
    if (!fileEntity) {
      return this.filesService.fileEntityToFileData(
        await this.filesService.create(opportunityId, sharepointId, {
          tagEntities,
        }),
      );
    }
    return this.filesService.fileEntityToFileData(
      await this.filesService.update(fileEntity, { tagEntities }),
    );
  }

  @ApiOperation({ description: 'Get file tags' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'opportunityId', type: String })
  @ApiQuery({ name: 'tagIds', type: String, required: false })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @Get(':id/files')
  public async getFiles(
    @Param('id', ParseUUIDPipe, ParseOpportunityPipe)
    opportunity: OpportunityEntity,
    @Query('tagIds', ParseTagsPipe, ValidateTabTagsPipe)
    tagEntities?: TagEntity[] | null,
  ): Promise<FileData[]> {
    return (await this.filesService.findAll(opportunity.id, tagEntities)).map(
      (fileEntity) => this.filesService.fileEntityToFileData(fileEntity),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an opportunity' })
  @ApiResponse({
    status: 200,
    description: 'The opportunity has been successfully deleted.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public remove(@Param('id') id: string): Promise<void> {
    return this.opportunityService.remove(id);
  }

  @Get(':id/team')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Get opportunity team' })
  @ApiResponse({ status: 200, description: 'The opportunity team details' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async getOpportunityTeam(
    @Param('id', ParseUUIDPipe, ParseOpportunityPipe)
    opportunity: OpportunityEntity,
  ): Promise<OpportunityTeamData> {
    return this.opportunityTeamService.getOpportunityTeam(opportunity);
  }

  @Post(':id/team')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Create opportunity team' })
  @ApiResponse({
    status: 200,
    description: 'The opportunity team has been successfully created.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async createOpportunityTeam(
    @Param('id', ParseUUIDPipe, ParseOpportunityPipe)
    opportunity: OpportunityEntity,
    @Identity(ParseUserFromIdentityPipe)
    userEntity: UserEntity,
    @Body() dto: CreateOrUpdateTeamDto,
  ): Promise<OpportunityTeamData> {
    const existingTeam =
      await this.opportunityTeamService.getOpportunityTeam(opportunity);
    if (existingTeam.owners.length > 0) {
      throw new BadRequestException(
        `Opportunity ${opportunity.id} already exists with owner ${existingTeam.owners[0].actorEmail}`,
      );
    }
    if (dto && dto.owners && dto.owners.length > 0) {
      return this.opportunityTeamService.modifyTeamMembers({
        opportunity,
        members: dto.members,
        owners: dto.owners,
      });
    }
    return this.opportunityTeamService.assignTeamMember(
      opportunity,
      userEntity,
      ShareRole.Owner,
    );
  }

  @Patch(':id/team')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Modify opportunity team members' })
  @ApiResponse({
    status: 200,
    description: 'The opportunity team has been successfully modified.',
  })
  @ApiOAuth2(['openid'])
  @CheckShare((ability: ShareAbility, context) =>
    ability.can(
      ShareAction.Edit,
      'o',
      (context.params.id as string)?.toString().toLowerCase(),
    ),
  )
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async modifyTeam(
    @Param('id', ParseUUIDPipe, ParseOpportunityPipe)
    opportunity: OpportunityEntity,
    @Body() dto: CreateOrUpdateTeamDto,
  ): Promise<OpportunityTeamData> {
    return await this.opportunityTeamService.modifyTeamMembers({
      opportunity,
      members: dto.members,
      owners: dto.owners,
    });
  }

  @Delete(':id/team/:userId')
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'userId', type: String })
  @ApiOperation({ summary: 'Remove team member from opportunity' })
  @ApiResponse({
    status: 200,
    description: 'The team member has been successfully removed.',
  })
  @ApiOAuth2(['openid'])
  @CheckShare((ability: ShareAbility, context) =>
    ability.can(
      ShareAction.Share,
      'o',
      (context.params.id as string)?.toString().toLowerCase(),
    ),
  )
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async removeTeamMember(
    @Param('id', ParseUUIDPipe, ParseOpportunityPipe)
    opportunity: OpportunityEntity,
    @Param('userId', ParseUUIDPipe, ParseUserPipe)
    userEntity: UserEntity,
  ): Promise<OpportunityTeamData> {
    return this.opportunityTeamService.removeTeamMember(
      opportunity,
      userEntity,
    );
  }
}
