import {
  EmptyResponseData,
  GenericCreateResponseSchema,
  GenericResponseSchema,
} from '@app/rvns-api';
import { PipelineDefinitionData, PipelineStageData } from '@app/rvns-pipelines';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParsePipelineStagePipe } from '../../shared/pipes/parse-pipeline-stage.pipe';
import { CreatePipelineStageDto } from './dto/create-pipeline-stage.dto';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineStageDto } from './dto/update-pipeline-stage.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { PipelineDefinitionEntity } from './entities/pipeline-definition.entity';
import { PipelineStageEntity } from './entities/pipeline-stage.entity';
import { PipelineService } from './pipeline.service';
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
  @Get()
  public async getAllPipelines(): Promise<PipelineDefinitionData[]> {
    return (await this.pipelineService.getAllPipelines()).map((pipeline) =>
      this.pipelineService.pipelineEntityToData(pipeline),
    );
  }

  @ApiOperation({ description: 'Get single pipeline' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  public async getPipeline(
    @Param('id', ParseUUIDPipe, ParsePipelineWithStagesPipe)
    pipelineEntity: PipelineDefinitionEntity,
  ): Promise<PipelineDefinitionData> {
    return this.pipelineService.pipelineEntityToData(pipelineEntity);
  }

  @ApiOperation({ description: 'Edit pipeline' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'id', type: 'string' })
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
  @Delete(':pipelineId')
  public async deletePipeline(
    @Param('pipelineId', ParseUUIDPipe, ParsePipelinePipe)
    pipelineEntity: PipelineDefinitionEntity,
  ): Promise<EmptyResponseData> {
    await this.pipelineService.deletePipeline(pipelineEntity);
  }
}
