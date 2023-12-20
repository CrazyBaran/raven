import { GenericResponseSchema } from '@app/rvns-api';
import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseChange } from './dto/change.dto';
import { PipelineDefinitionStaticData } from './dto/pipeline-definition.static-data.dto';
import { TemplateStaticData } from './dto/template.static-data.dto';
import { PipelineStaticDataService } from './pipeline-static-data.service';
import { TemplateStaticDataService } from './template-static-data.service';

@ApiOAuth2(['openid'])
@ApiTags('Static Data')
@Controller('static-data')
export class StaticDataController {
  public constructor(
    private readonly pipelineStaticDataService: PipelineStaticDataService,
    private readonly templateStaticDataService: TemplateStaticDataService,
  ) {}

  @ApiOperation({ description: 'Get all pipeline static data' })
  @ApiResponse(GenericResponseSchema())
  @Get('pipelines')
  public async getAllPipelineStaticData(): Promise<
    PipelineDefinitionStaticData[]
  > {
    return await this.pipelineStaticDataService.getAllPipelineStaticData();
  }

  @ApiOperation({ description: 'Compare pipeline static data' })
  @ApiResponse(GenericResponseSchema())
  @Patch('pipelines')
  public async comparePipelineStaticData(
    @Body() pipelines: PipelineDefinitionStaticData[],
  ): Promise<BaseChange[]> {
    return await this.pipelineStaticDataService.compareExistingPipelineStaticData(
      pipelines,
    );
  }

  @ApiOperation({ description: 'Apply pipeline static data' })
  @ApiResponse(GenericResponseSchema())
  @Post('pipelines')
  public async applyPipelineStaticData(
    @Body() changes: BaseChange[],
  ): Promise<void> {
    return await this.pipelineStaticDataService.applyPipelineStaticData(
      changes,
    );
  }

  @ApiOperation({ description: 'Get all template static data' })
  @ApiResponse(GenericResponseSchema())
  @Get('templates')
  public async getAllTemplateStaticData(): Promise<TemplateStaticData[]> {
    return await this.templateStaticDataService.getAllTemplateStaticData();
  }

  @ApiOperation({ description: 'Compare template static data' })
  @ApiResponse(GenericResponseSchema())
  @Patch('templates')
  public async compareTemplateStaticData(
    @Body() templates: TemplateStaticData[],
  ): Promise<BaseChange[]> {
    return await this.templateStaticDataService.compareExistingTemplateStaticData(
      templates,
    );
  }

  @ApiOperation({ description: 'Apply template static data' })
  @ApiResponse(GenericResponseSchema())
  @Post('templates')
  public async applyTemplateStaticData(
    @Body() changes: BaseChange[],
  ): Promise<void> {
    return await this.templateStaticDataService.applyTemplateStaticData(
      changes,
    );
  }
}
