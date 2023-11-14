import { OpportunityData } from '@app/rvns-opportunities';
import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import {
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindOrganizationByDomainPipe } from '../../shared/pipes/find-organization-by-domain.pipe';
import { ParseUserFromIdentityPipe } from '../../shared/pipes/parse-user-from-identity.pipe';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';
import { OpportunityService } from './opportunity.service';
import { ParseOpportunityPipe } from './pipes/parse-opportunity.pipe';
import { ParseOptionalPipelineStagePipe } from './pipes/parse-optional-pipeline-stage.pipe';
import { ParseOptionalTagPipe } from './pipes/parse-optional-tag.pipe';
import { ParseWorkflowTemplatePipe } from './pipes/parse-workflow-template.pipe';
import { ValidateOpportunityTagPipe } from './pipes/validate-opportunity-tag.pipe';

@ApiTags('Opportunities')
@Controller('opportunities')
export class OpportunityController {
  public constructor(private readonly opportunityService: OpportunityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all opportunities' })
  @ApiResponse({ status: 200, description: 'List of opportunities' })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'pipelineStageId', type: String, required: false })
  @ApiQuery({ name: 'domain', type: String, required: false })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('domain') domain?: string,
    @Query('pipelineStageId') pipelineStageId?: string,
  ): Promise<OpportunityData[]> {
    if (skip || take) {
      return await this.opportunityService.findAll(skip, take, pipelineStageId);
    } else if (domain) {
      return await this.opportunityService.findByDomain(domain);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single opportunity' })
  @ApiResponse({ status: 200, description: 'The opportunity details' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public findOne(@Param('id') id: string): Promise<OpportunityData> {
    return this.opportunityService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new opportunity' })
  @ApiResponse({
    status: 201,
    description: 'The opportunity has been successfully created.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public async create(
    @Body() dto: CreateOpportunityDto,
    @Body('domain', FindOrganizationByDomainPipe)
    organisation: OrganisationEntity | null,
    @Body('workflowTemplateId', ParseUUIDPipe, ParseWorkflowTemplatePipe)
    workflowTemplate: TemplateEntity,
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
  ): Promise<OpportunityData> {
    if (organisation) {
      // TODO - find previous opportunity, check if is at last stage? remove or soft delete? confirm logic for that
      // TODO - current logic should be one opportunity for given organisation is in active stages...
      return this.opportunityService.opportunityEntityToData(
        await this.opportunityService.createFromOrganisation({
          organisation,
          workflowTemplate,
          userEntity,
        }),
      );
    }

    return this.opportunityService.opportunityEntityToData(
      await this.opportunityService.createForNonExistingOrganisation({
        name: dto.name,
        domain: dto.domain,
        workflowTemplate,
        userEntity,
      }),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an opportunity' })
  @ApiResponse({
    status: 200,
    description: 'The opportunity has been successfully updated.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public async update(
    @Param('id', ParseUUIDPipe, ParseOpportunityPipe)
    opportunity: OpportunityEntity,
    @Body() dto: UpdateOpportunityDto,
    @Body('pipelineStageId', ParseOptionalPipelineStagePipe)
    pipelineStage: string | PipelineStageEntity | null,
    @Body('tagId', ParseOptionalTagPipe, ValidateOpportunityTagPipe)
    tag: string | TagEntity | null,
  ): Promise<OpportunityData> {
    return this.opportunityService.opportunityEntityToData(
      await this.opportunityService.update(opportunity, {
        pipelineStage: pipelineStage as PipelineStageEntity,
        tag: tag as TagEntity,
      }),
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
  @Roles(RoleEnum.User)
  public remove(@Param('id') id: string): Promise<void> {
    return this.opportunityService.remove(id);
  }
}
