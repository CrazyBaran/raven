import { GenericCreateResponseSchema } from '@app/rvns-api';
import { PipelineDefinitionData } from '@app/rvns-pipelines';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { PipelineService } from './pipeline.service';

@Controller('pipeline')
export class PipelineController {
  public constructor(private readonly pipelineService: PipelineService) {}

  @ApiOperation({ description: 'Create pipeline' })
  @ApiResponse(GenericCreateResponseSchema())
  @Post()
  public async createPipeline(
    @Body() dto: CreatePipelineDto,
  ): Promise<PipelineDefinitionData> {
    return this.pipelineService.createPipeline();
  }
}
