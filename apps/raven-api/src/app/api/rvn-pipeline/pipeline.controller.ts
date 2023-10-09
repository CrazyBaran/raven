import { GenericCreateResponseSchema } from '@app/rvns-api';
import { PipelineDefinitionData } from '@app/rvns-pipelines';
import { Body, Controller, Post } from '@nestjs/common';
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
}
