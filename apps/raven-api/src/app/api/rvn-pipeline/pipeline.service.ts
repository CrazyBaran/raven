import { PipelineDefinitionData, PipelineStageData } from '@app/rvns-pipelines';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelineDefinitionEntity } from './entities/pipeline-definition.entity';

@Injectable()
export class PipelineService {
  public constructor(
    @InjectRepository(PipelineDefinitionEntity)
    private readonly pipelineDefinitionRepository: Repository<PipelineDefinitionEntity>,
  ) {}

  public async createPipeline(): Promise<PipelineDefinitionEntity> {
    const pipeline = new PipelineDefinitionEntity();
    pipeline.stages = [];
    return this.pipelineDefinitionRepository.save(pipeline);
  }

  public pipelineEntityToData(
    entity: PipelineDefinitionEntity,
  ): PipelineDefinitionData {
    return {
      id: entity.id,
      stages: entity.stages.map((stage) => ({
        id: stage.id,
        displayName: stage.displayName,
        order: stage.order,
        mappedFrom: stage.mappedFrom,
      })),
    };
  }

  public async getDefaultDefinition(): Promise<PipelineDefinitionData> {
    const pipelineDefinitions = await this.pipelineDefinitionRepository.find();
    const defaultDefinition = pipelineDefinitions[0];
    return this.pipelineEntityToData(defaultDefinition);
  }

  public async mapStage(
    pipelineDefinition: PipelineDefinitionData,
    text: string,
  ): Promise<PipelineStageData> {
    return pipelineDefinition.stages.find((s) =>
      text.toLowerCase().includes(s.mappedFrom.toLowerCase()),
    );
  }
}
