import {
  GenericCreateResponseSchema,
  GenericResponseSchema,
} from '@app/rvns-api';
import { PipelineDefinitionData } from '@app/rvns-pipelines';
import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOAuth2,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { PipelineService } from './pipeline.service';

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
      await this.pipelineService.createPipeline({ stages: dto.stages }),
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
}
