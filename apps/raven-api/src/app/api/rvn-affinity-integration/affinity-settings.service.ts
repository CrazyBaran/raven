import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';

@Injectable()
export class AffinitySettingsService {
  public constructor(
    @InjectRepository(PipelineDefinitionEntity)
    private readonly pipelineDefinitionRepository: Repository<PipelineDefinitionEntity>,
  ) {}

  public async getListSettings(): Promise<{
    listId: number;
    statusFieldId: number;
  }> {
    const pipelineDefinition = await this.getDefaultPipelineDefinition();
    if (!pipelineDefinition) {
      throw new Error('Default pipeline definition not found');
    }

    if (
      !pipelineDefinition.affinityListId ||
      !pipelineDefinition.affinityStatusFieldId
    ) {
      throw new Error('Affinity list ID or status field ID not set');
    }

    return {
      listId: pipelineDefinition.affinityListId,
      statusFieldId: pipelineDefinition.affinityStatusFieldId,
    };
  }

  private async getDefaultPipelineDefinition(): Promise<PipelineDefinitionEntity> {
    const pipelineDefinition = await this.pipelineDefinitionRepository.findOne({
      relations: ['stages'],
      where: {
        isDefault: true,
      },
    });
    return pipelineDefinition;
  }
}
