import { PipelineDefinitionData, PipelineStageData } from '@app/rvns-pipelines';
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
  readonly name: string;
  readonly isDefault: boolean;
  readonly stages: PipelineStage[];
}

interface UpdatePipelineOptions {
  readonly name?: string;
  readonly isDefault?: boolean;
}

interface CreatePipelineStageOptions {
  readonly displayName: string;
  readonly order: number;
  readonly mappedFrom: string;
}

type UpdatePipelineStageOptions = Partial<CreatePipelineStageOptions>;

@Injectable()
export class PipelineService {
  public constructor(
    @InjectRepository(PipelineDefinitionEntity)
    private readonly pipelineDefinitionRepository: Repository<PipelineDefinitionEntity>,
    @InjectRepository(PipelineStageEntity)
    private readonly pipelineStageRepository: Repository<PipelineStageEntity>,
  ) {}

  public async createPipeline(
    options: CreatePipelineOptions,
  ): Promise<PipelineDefinitionEntity> {
    const pipeline = new PipelineDefinitionEntity();
    pipeline.name = options.name;
    pipeline.isDefault = options.isDefault;
    pipeline.stages = options.stages.map((stage) => {
      const pipelineStage = new PipelineStageEntity();
      pipelineStage.displayName = stage.displayName;
      pipelineStage.order = stage.order;
      pipelineStage.mappedFrom = stage.mappedFrom;
      return pipelineStage;
    });
    return this.pipelineDefinitionRepository.save(pipeline);
  }

  public async getAllPipelines(
    defaultOnly: boolean,
  ): Promise<PipelineDefinitionEntity[]> {
    return this.pipelineDefinitionRepository.find({
      relations: ['stages'],
      where: defaultOnly ? { isDefault: true } : {},
    });
  }

  public async updatePipeline(
    pipelineEntity: PipelineDefinitionEntity,
    options: UpdatePipelineOptions,
  ): Promise<PipelineDefinitionEntity> {
    if (options.name) {
      pipelineEntity.name = options.name;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'isDefault')) {
      pipelineEntity.isDefault = options.isDefault;
    }
    delete pipelineEntity.stages;
    return this.pipelineDefinitionRepository.save(pipelineEntity);
  }

  public async updatePipelineStage(
    pipelineStageEntity: PipelineStageEntity,
    options: UpdatePipelineStageOptions,
  ): Promise<PipelineStageEntity> {
    if (options.displayName) {
      pipelineStageEntity.displayName = options.displayName;
    }
    if (options.order) {
      pipelineStageEntity.order = options.order;
    }
    if (options.mappedFrom) {
      pipelineStageEntity.mappedFrom = options.mappedFrom;
    }
    return this.pipelineStageRepository.save(pipelineStageEntity);
  }

  public async createPipelineStage(
    pipelineEntity: PipelineDefinitionEntity,
    options: CreatePipelineStageOptions,
  ): Promise<PipelineStageEntity> {
    const pipelineStage = new PipelineStageEntity();
    pipelineStage.displayName = options.displayName;
    pipelineStage.order = options.order;
    pipelineStage.mappedFrom = options.mappedFrom;
    pipelineStage.pipelineDefinition = pipelineEntity;
    return this.pipelineStageRepository.save(pipelineStage);
  }

  public async deletePipelineStage(
    pipelineStageEntity: PipelineStageEntity,
  ): Promise<void> {
    await this.pipelineStageRepository.remove(pipelineStageEntity);
  }

  public async deletePipeline(
    pipelineEntity: PipelineDefinitionEntity,
  ): Promise<void> {
    await this.pipelineDefinitionRepository.remove(pipelineEntity);
  }

  public pipelineEntityToData(
    entity: PipelineDefinitionEntity,
  ): PipelineDefinitionData {
    return {
      id: entity.id,
      name: entity.name,
      isDefault: entity.isDefault,
      stages: entity.stages?.map((stage) => ({
        id: stage.id,
        displayName: stage.displayName,
        order: stage.order,
        mappedFrom: stage.mappedFrom,
      })),
    };
  }

  public pipelineStageEntityToData(
    entity: PipelineStageEntity,
  ): PipelineStageData {
    return {
      id: entity.id,
      displayName: entity.displayName,
      order: entity.order,
      mappedFrom: entity.mappedFrom,
    };
  }
}
