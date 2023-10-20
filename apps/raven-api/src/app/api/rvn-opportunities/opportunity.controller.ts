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
import { ParsePipelineStagePipe } from '../../shared/pipes/parse-pipeline-stage.pipe';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';
import { OpportunityService } from './opportunity.service';
import { ParseOpportunityPipe } from './pipes/parse-opportunity.pipe';

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
  ): Promise<OpportunityData> {
    if (organisation) {
      // TODO - find previous opportunity, check if is at last stage? remove or soft delete? confirm logic for that
      // TODO - current logic should be one opportunity for given organisation is in active stages...
      return this.opportunityService.opportunityEntityToData(
        await this.opportunityService.createFromOrganisation({ organisation }),
      );
    }

    return this.opportunityService.opportunityEntityToData(
      await this.opportunityService.createForNonExistingOrganisation({
        name: dto.name,
        domain: dto.domain,
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
    @Body('pipelineStageId', ParseUUIDPipe, ParsePipelineStagePipe)
    pipelineStage: PipelineStageEntity,
  ): Promise<OpportunityData> {
    return this.opportunityService.opportunityEntityToData(
      await this.opportunityService.update(opportunity, { pipelineStage }),
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
