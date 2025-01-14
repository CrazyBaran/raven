import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyStatus } from 'rvns-shared';
import { FindOneOptions, Repository } from 'typeorm';
import { PipelineDefinitionEntity } from './entities/pipeline-definition.entity';
import { PipelineStageEntity } from './entities/pipeline-stage.entity';

@Injectable()
export class PipelineUtilityService {
  public constructor(
    @InjectRepository(PipelineDefinitionEntity)
    private readonly pipelineDefinitionRepository: Repository<PipelineDefinitionEntity>,
    @InjectRepository(PipelineStageEntity)
    private readonly pipelineStageRepository: Repository<PipelineStageEntity>,
  ) {}

  public async getDefaultPipelineDefinition(): Promise<PipelineDefinitionEntity> {
    return await this.pipelineDefinitionRepository.findOne({
      where: { isDefault: true },
      relations: ['stages'],
    });
  }

  public async getDefaultPipelineStage(
    pipelineDefinitionId?: string,
  ): Promise<PipelineStageEntity> {
    const findOptions = {
      where: { isDefault: true },
    } as FindOneOptions<PipelineStageEntity>;
    findOptions.where = {
      ...findOptions.where,
      pipelineDefinitionId:
        pipelineDefinitionId ?? (await this.getDefaultPipelineDefinition()).id,
    };

    return (
      (await this.pipelineStageRepository.findOne(findOptions)) ??
      (await this.getDefaultPipelineStageByOrder(pipelineDefinitionId))
    );
  }

  public async mapStageForDefaultPipeline(
    text: string,
  ): Promise<PipelineStageEntity> {
    const pipelineDefinition = await this.getDefaultPipelineDefinition();

    const pipelineStage = pipelineDefinition.stages.find(
      (stage) =>
        stage != null &&
        stage.mappedFrom != null &&
        text?.toLowerCase() === stage?.mappedFrom?.toLowerCase(),
    );

    return pipelineStage ?? (await this.getDefaultPipelineStage());
  }

  public async getPipelineStageOrDefault(
    id: string,
    pipelineDefinition?: PipelineDefinitionEntity,
  ): Promise<PipelineStageEntity> {
    let pipelineStage;

    if (pipelineDefinition) {
      pipelineStage = pipelineDefinition.stages.find(
        (stage) => stage.id === id,
      );
    } else {
      pipelineStage = await this.pipelineStageRepository.findOne({
        where: { id },
      });
    }

    return pipelineStage ?? (await this.getDefaultPipelineStage());
  }

  public isActivePipelineItemStage(
    pipelineStage: PipelineStageEntity,
  ): boolean {
    if (pipelineStage.isHidden) {
      return false;
    }

    if (pipelineStage.configuration) {
      return false;
    }

    return true;
  }

  public async getFirstLiveOpportunityStage(
    pipelineDefinitionId?: string,
  ): Promise<PipelineStageEntity> {
    const findOptions = {
      where: {
        relatedCompanyStatus: CompanyStatus.LIVE_OPPORTUNITY,
      },
      order: {
        order: 'ASC',
      },
      top: 1,
    } as FindOneOptions<PipelineStageEntity>;
    findOptions.where = {
      ...findOptions.where,
      pipelineDefinitionId:
        pipelineDefinitionId ?? (await this.getDefaultPipelineDefinition()).id,
    };

    const result = await this.pipelineStageRepository.find(findOptions);
    return result.length > 0
      ? result[0]
      : await this.getDefaultPipelineStageByOrder(pipelineDefinitionId);
  }

  public async getPassedOpportunityStage(
    pipelineDefinitionId?: string,
  ): Promise<PipelineStageEntity> {
    const findOptions = {
      where: {
        relatedCompanyStatus: CompanyStatus.PASSED,
      },
      order: {
        order: 'ASC',
      },
      top: 1,
    } as FindOneOptions<PipelineStageEntity>;
    findOptions.where = {
      ...findOptions.where,
      pipelineDefinitionId:
        pipelineDefinitionId ?? (await this.getDefaultPipelineDefinition()).id,
    };

    const result = await this.pipelineStageRepository.find(findOptions);
    return result.length > 0
      ? result[0]
      : await this.getDefaultPipelineStageByOrder(pipelineDefinitionId);
  }

  private async getDefaultPipelineStageByOrder(
    pipelineDefinitionId?: string,
  ): Promise<PipelineStageEntity> {
    const pipelineDefinition = await this.pipelineDefinitionRepository.findOne({
      where: {
        id:
          pipelineDefinitionId ??
          (await this.getDefaultPipelineDefinition()).id,
      },
      relations: ['stages'],
    });
    const lowestOrder = Math.min(
      ...pipelineDefinition.stages.map((stage) => stage.order),
    );
    return pipelineDefinition.stages.find(
      (stage) => stage.order === lowestOrder,
    );
  }
}
