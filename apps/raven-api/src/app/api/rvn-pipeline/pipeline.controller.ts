import {
  EmptyResponseData,
  GenericCreateResponseSchema,
  GenericResponseSchema,
} from '@app/rvns-api';
import { PipelineDefinitionData, PipelineStageData } from '@app/rvns-pipelines';
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
  ApiBody,
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PipelineGroupingDataInterface } from '../../../../../../libs/rvns-pipelines/src/data/pipeline-grouping-data.interface';
import { ParsePipelineStagePipe } from '../../shared/pipes/parse-pipeline-stage.pipe';
import { CreatePipelineGroupDto } from './dto/create-pipeline-group.dto';
import { CreatePipelineStageDto } from './dto/create-pipeline-stage.dto';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineGroupDto } from './dto/update-pipeline-group.dto';
import { UpdatePipelineStageDto } from './dto/update-pipeline-stage.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { PipelineDefinitionEntity } from './entities/pipeline-definition.entity';
import { PipelineGroupEntity } from './entities/pipeline-group.entity';
import { PipelineStageEntity } from './entities/pipeline-stage.entity';
import { PipelineService } from './pipeline.service';
import { ParsePipelineGroupWithStagesPipe } from './pipes/parse-pipeline-group-with-stages.pipe';
import { ParsePipelineWithStagesPipe } from './pipes/parse-pipeline-with-stages.pipe';
import { ParsePipelinePipe } from './pipes/parse-pipeline.pipe';

@ApiOAuth2(['openid'])
@ApiTags('Pipelines')
@Controller('pipeline')
export class PipelineController {
  public constructor(private readonly pipelineService: PipelineService) {}

  @ApiOperation({ description: 'Create pipeline' })
  @ApiResponse(GenericCreateResponseSchema())
  @ApiBody({ type: CreatePipelineDto })
  @Roles(RoleEnum.SuperAdmin, RoleEnum.User)
  @Post()
  public async createPipeline(
    @Body() dto: CreatePipelineDto,
  ): Promise<PipelineDefinitionData> {
    return this.pipelineService.pipelineEntityToData(
      await this.pipelineService.createPipeline({
        name: dto.name,
        isDefault: dto.isDefault,
        stages: dto.stages,
      }),
    );
  }

  @ApiOperation({ description: 'Get all pipelines' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'defaultOnly', type: 'boolean', required: false })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @Get()
  public async getAllPipelines(
    @Query('defaultOnly') defaultOnly: boolean = true,
  ): Promise<PipelineDefinitionData[]> {
    return (await this.pipelineService.getAllPipelines(defaultOnly)).map(
      (pipeline) => this.pipelineService.pipelineEntityToData(pipeline),
    );
  }

  @ApiOperation({ description: 'Get single pipeline' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'id', type: 'string' })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @Get(':id')
  public async getPipeline(
    @Param('id', ParseUUIDPipe, ParsePipelineWithStagesPipe)
    pipelineEntity: PipelineDefinitionEntity,
  ): Promise<PipelineDefinitionData> {
    return this.pipelineService.pipelineEntityToData(pipelineEntity);
  }

  @ApiOperation({ description: 'Create pipeline groups' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'pipelineId', type: 'string' })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin) // TODO change to only superAdmin
  @Post(':pipelineId/groups')
  public async createPipelineGroups(
    @Param('pipelineId', ParseUUIDPipe, ParsePipelineWithStagesPipe)
    pipelineEntity: PipelineDefinitionEntity,
    @Body() dto: CreatePipelineGroupDto,
  ): Promise<PipelineGroupingDataInterface> {
    const groups = await this.pipelineService.createPipelineGroups(
      pipelineEntity,
      dto.groups,
    );
    return this.pipelineService.pipelineGroupsEntityToGroupingData(
      pipelineEntity,
      groups,
    );
  }

  @ApiOperation({ description: 'Update pipeline group' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'pipelineId', type: 'string' })
  @ApiParam({ name: 'id', type: 'string' })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin) // TODO change to only superAdmin
  @Patch(':pipelineId/groups/:id')
  public async updatePipelineGroups(
    @Param('pipelineId', ParseUUIDPipe, ParsePipelineWithStagesPipe)
    pipelineEntity: PipelineDefinitionEntity,
    @Param('id', ParseUUIDPipe, ParsePipelineGroupWithStagesPipe)
    pipelineGroupEntity: PipelineGroupEntity,
    @Body() dto: UpdatePipelineGroupDto,
  ): Promise<any> {
    return this.pipelineService.updatePipelineGroup(
      pipelineEntity,
      pipelineGroupEntity,
      {
        name: dto.name,
        stageIds: dto.stageIds,
      },
    );
  }

  @ApiOperation({ description: 'Get pipeline groups' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'pipelineId', type: 'string' })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @Get(':pipelineId/groups')
  public async getPipelineGroups(
    @Param('pipelineId', ParseUUIDPipe, ParsePipelineWithStagesPipe)
    pipelineEntity: PipelineDefinitionEntity,
  ): Promise<any> {
    return this.pipelineService.pipelineGroupsEntityToGroupingData(
      pipelineEntity,
      await this.pipelineService.getPipelineGroups(pipelineEntity),
    );
  }

  @ApiOperation({ description: 'Edit pipeline' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'id', type: 'string' })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @Patch(':id')
  public async editPipeline(
    @Param('id', ParseUUIDPipe, ParsePipelinePipe)
    pipelineEntity: PipelineDefinitionEntity,
    @Body() dto: UpdatePipelineDto,
  ): Promise<PipelineDefinitionData> {
    return this.pipelineService.pipelineEntityToData(
      await this.pipelineService.updatePipeline(pipelineEntity, {
        name: dto.name,
        isDefault: dto.isDefault,
      }),
    );
  }

  @ApiOperation({ description: 'Edit pipeline stage' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'pipelineId', type: 'string' })
  @ApiParam({ name: 'pipelineStageId', type: 'string' })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @Patch(':pipelineId/stages/:pipelineStageId')
  public async editPipelineStage(
    @Param('pipelineId', ParseUUIDPipe, ParsePipelinePipe)
    pipelineEntity: PipelineDefinitionEntity,
    @Param('pipelineStageId', ParseUUIDPipe, ParsePipelineStagePipe)
    pipelineStageEntity: PipelineStageEntity,
    @Body()
    dto: UpdatePipelineStageDto,
  ): Promise<PipelineStageData> {
    return this.pipelineService.pipelineStageEntityToData(
      await this.pipelineService.updatePipelineStage(pipelineStageEntity, {
        displayName: dto.displayName,
        order: dto.order,
        mappedFrom: dto.mappedFrom,
      }),
    );
  }

  @ApiOperation({ description: 'Add pipeline stage' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'pipelineId', type: 'string' })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @Post(':pipelineId/stages')
  public async createPipelineStage(
    @Param('pipelineId', ParseUUIDPipe, ParsePipelinePipe)
    pipelineEntity: PipelineDefinitionEntity,
    @Body()
    dto: CreatePipelineStageDto,
  ): Promise<PipelineStageData> {
    return this.pipelineService.pipelineStageEntityToData(
      await this.pipelineService.createPipelineStage(pipelineEntity, {
        displayName: dto.displayName,
        order: dto.order,
        mappedFrom: dto.mappedFrom,
      }),
    );
  }

  @ApiOperation({ description: 'Delete pipeline stage' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'pipelineId', type: 'string' })
  @ApiParam({ name: 'pipelineStageId', type: 'string' })
  @Roles(RoleEnum.SuperAdmin)
  @Delete(':pipelineId/stages/:pipelineStageId')
  public async deletePipelineStage(
    @Param('pipelineId', ParseUUIDPipe, ParsePipelinePipe)
    pipelineEntity: PipelineDefinitionEntity,
    @Param('pipelineStageId', ParseUUIDPipe, ParsePipelineStagePipe)
    pipelineStageEntity: PipelineStageEntity,
  ): Promise<EmptyResponseData> {
    await this.pipelineService.deletePipelineStage(pipelineStageEntity);
  }

  @ApiOperation({ description: 'Delete pipeline' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'pipelineId', type: 'string' })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  @Delete(':pipelineId')
  public async deletePipeline(
    @Param('pipelineId', ParseUUIDPipe, ParsePipelinePipe)
    pipelineEntity: PipelineDefinitionEntity,
  ): Promise<EmptyResponseData> {
    await this.pipelineService.deletePipeline(pipelineEntity);
  }
}
