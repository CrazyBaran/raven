import { PipelineDefinitionData } from '@app/rvns-pipelines';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelineDefinitionEntity } from './entities/pipeline-definition.entity';
import { PipelineStageEntity } from './entities/pipeline-stage.entity';

interface PipelineStage {
  readonly displayName: string;
  readonly order: number;
  readonly mappedFrom: string;
}

interface CreatePipelineOptions {
  readonly stages: PipelineStage[];
}

@Injectable()
export class PipelineService {
  public constructor(
    @InjectRepository(PipelineDefinitionEntity)
    private readonly pipelineDefinitionRepository: Repository<PipelineDefinitionEntity>,
  ) {}

  public async createPipeline(
    options: CreatePipelineOptions,
  ): Promise<PipelineDefinitionEntity> {
    const pipeline = new PipelineDefinitionEntity();
    pipeline.stages = options.stages.map((stage) => {
      const pipelineStage = new PipelineStageEntity();
      pipelineStage.displayName = stage.displayName;
      pipelineStage.order = stage.order;
      pipelineStage.mappedFrom = stage.mappedFrom;
      return pipelineStage;
    });
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
}
