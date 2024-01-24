import {
  PipelineDefinitionData,
  PipelineGroupData,
  PipelineGroupingDataInterface,
  PipelineStageData,
} from '@app/rvns-pipelines';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelineDefinitionEntity } from './entities/pipeline-definition.entity';
import { PipelineGroupEntity } from './entities/pipeline-group.entity';
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
  readonly configuration: string | null;
  readonly showFields?: { fieldName: string; displayName: string }[];
  readonly isHidden?: boolean;
}

interface PipelineGroupsOptions {
  readonly name: string;
  readonly stageIds: string[];
}

interface UpdatePipelineGroupOptions {
  readonly name?: string;
  readonly stageIds?: string[];
}

type UpdatePipelineStageOptions = Partial<CreatePipelineStageOptions>;

@Injectable()
export class PipelineService {
  public constructor(
    @InjectRepository(PipelineDefinitionEntity)
    private readonly pipelineDefinitionRepository: Repository<PipelineDefinitionEntity>,
    @InjectRepository(PipelineStageEntity)
    private readonly pipelineStageRepository: Repository<PipelineStageEntity>,
    @InjectRepository(PipelineGroupEntity)
    private readonly pipelineGroupRepository: Repository<PipelineGroupEntity>,
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

  public async createPipelineGroups(
    pipelineDefinition: PipelineDefinitionEntity,
    pipelineGroups: PipelineGroupsOptions[],
  ): Promise<PipelineGroupEntity[]> {
    this.validatePipelineGroups(pipelineDefinition, pipelineGroups);
    const existingGroups = await this.getPipelineGroups(pipelineDefinition);
    if (existingGroups.length > 0) {
      throw new BadRequestException(
        'Pipeline groups already exist for this pipeline',
      );
    }
    const groups = pipelineGroups.map((group) => {
      const pipelineGroup = new PipelineGroupEntity();
      pipelineGroup.groupName = group.name;
      pipelineGroup.stages = pipelineDefinition.stages.filter((stage) =>
        group.stageIds.includes(stage.id),
      );
      return pipelineGroup;
    });
    return await this.pipelineGroupRepository.save(groups);
  }

  public async getPipelineGroups(
    pipelineDefinition: PipelineDefinitionEntity,
  ): Promise<PipelineGroupEntity[]> {
    return await this.pipelineGroupRepository
      .createQueryBuilder('pipelineGroup')
      .innerJoinAndSelect('pipelineGroup.stages', 'stage')
      .where('stage.pipelineDefinitionId = :pipelineDefinitionId', {
        pipelineDefinitionId: pipelineDefinition.id,
      })
      .getMany();
  }

  public async updatePipelineGroup(
    pipelineEntity: PipelineDefinitionEntity,
    pipelineGroupEntity: PipelineGroupEntity,
    options: UpdatePipelineGroupOptions,
  ): Promise<PipelineGroupEntity> {
    const existingGroups = await this.getPipelineGroups(pipelineEntity);
    this.validatePipelineGroups(pipelineEntity, [
      {
        name: options.name || pipelineGroupEntity.groupName,
        stageIds:
          options.stageIds ||
          pipelineGroupEntity.stages.map((stage) => stage.id),
      },
      ...existingGroups
        .filter((group) => group.id !== pipelineGroupEntity.id)
        .map((group) => ({
          name: group.groupName,
          stageIds: group.stages.map((stage) => stage.id),
        })),
    ]);

    return await this.pipelineGroupRepository.manager.transaction(
      async (tem) => {
        if (options.name) {
          pipelineGroupEntity.groupName = options.name;
        }
        const stagesToAdd =
          options.stageIds && options.stageIds.length > 0
            ? pipelineEntity.stages.filter((stage) =>
                options.stageIds.includes(stage.id),
              )
            : [];
        if (stagesToAdd.length > 0) {
          await tem
            .createQueryBuilder()
            .relation(PipelineGroupEntity, 'stages')
            .of(pipelineGroupEntity)
            .addAndRemove(stagesToAdd, pipelineGroupEntity.stages);
        }
        const previousStages = pipelineGroupEntity.stages;
        delete pipelineGroupEntity.stages;
        const savedGroup =
          await this.pipelineGroupRepository.save(pipelineGroupEntity);
        savedGroup.stages =
          stagesToAdd.length > 0 ? stagesToAdd : previousStages;
        return savedGroup;
      },
    );
  }

  public async deletePipelineGroup(
    pipelineGroupEntity: PipelineGroupEntity,
  ): Promise<void> {
    await this.pipelineGroupRepository.remove(pipelineGroupEntity);
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
    if (options.configuration) {
      pipelineStageEntity.configuration = options.configuration;
    }
    if (options.showFields) {
      pipelineStageEntity.showFields = JSON.stringify(options.showFields);
    }
    if (Object.prototype.hasOwnProperty.call(options, 'isHidden')) {
      pipelineStageEntity.isHidden = options.isHidden;
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
    pipelineStage.configuration = options.configuration;
    pipelineStage.isHidden = options.isHidden || false;
    if (options.showFields) {
      pipelineStage.showFields = JSON.stringify(options.showFields);
    }
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
    groups?: PipelineGroupEntity[],
  ): PipelineDefinitionData {
    return {
      id: entity.id,
      name: entity.name,
      isDefault: entity.isDefault,
      stages: entity.stages?.map((stage) =>
        this.pipelineStageEntityToData(stage),
      ),
      groups: groups?.map((group) => this.pipelineGroupEntityToData(group)),
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
      configuration: entity.configuration
        ? JSON.parse(entity.configuration)
        : null,
      showFields: entity.showFields ? JSON.parse(entity.showFields) : null,
      isHidden: entity.isHidden || false,
    };
  }

  public pipelineGroupsEntityToGroupingData(
    pipelineEntity: PipelineDefinitionEntity,
    groups: PipelineGroupEntity[],
  ): PipelineGroupingDataInterface {
    return {
      pipelineId: pipelineEntity.id,
      groups: groups.map((group) => this.pipelineGroupEntityToData(group)),
    };
  }

  public pipelineGroupEntityToData(
    group: PipelineGroupEntity,
  ): PipelineGroupData {
    return {
      id: group.id,
      name: group.groupName,
      stages: group.stages?.map((stage) => ({
        id: stage.id,
        displayName: stage.displayName,
      })),
    };
  }

  private validatePipelineGroups(
    pipelineDefinition: PipelineDefinitionEntity,
    pipelineGroups: PipelineGroupsOptions[],
  ): void {
    const validationErrors = [];
    const pipelineStageIds = pipelineDefinition.stages.map((stage) => stage.id);
    const pipelineGroupStageIds = pipelineGroups.reduce<string[]>(
      (acc, group) => [...acc, ...group.stageIds],
      [],
    );
    const missingStageIds = pipelineGroupStageIds.filter(
      (stageId) => !pipelineStageIds.includes(stageId),
    );
    if (missingStageIds.length > 0) {
      validationErrors.push(
        `Pipeline definition is missing stages: ${missingStageIds.join(', ')}`,
      );
    }

    const duplicateStageIds = pipelineGroupStageIds.filter(
      (stageId, index, self) => self.indexOf(stageId) !== index,
    );
    if (duplicateStageIds.length > 0) {
      validationErrors.push(
        `Pipeline definition has duplicate stages: ${duplicateStageIds.join(
          ', ',
        )}`,
      );
    }
    const duplicateGroupNames = pipelineGroups
      .filter(
        (group, index, self) =>
          self.findIndex((g) => g.name === group.name) !== index,
      )
      .map((g) => g.name);
    if (duplicateGroupNames.length > 0) {
      validationErrors.push(
        `Pipeline groups have duplicate names: ${duplicateGroupNames.join(
          ', ',
        )}`,
      );
    }
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors.join('; '));
    }
  }
}
