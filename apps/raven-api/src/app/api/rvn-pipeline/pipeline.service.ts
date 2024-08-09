import {
  PipelineDefinitionData,
  PipelineGroupData,
  PipelineGroupingData,
  PipelineStageData,
  PipelineViewData,
  PipelineViewsData,
} from '@app/rvns-pipelines';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyStatus } from 'rvns-shared';
import { Repository } from 'typeorm';
import { PipelineDefinitionEntity } from './entities/pipeline-definition.entity';
import { PipelineGroupEntity } from './entities/pipeline-group.entity';
import { PipelineStageEntity } from './entities/pipeline-stage.entity';
import { PipelineViewEntity } from './entities/pipeline-view.entity';

interface PipelineStage {
  readonly displayName: string;
  readonly order: number;
  readonly mappedFrom: string;
  readonly relatedCompanyStatus?: CompanyStatus | null;
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
  readonly isDefault?: boolean;
  readonly relatedCompanyStatus?: CompanyStatus | null;
}

interface PipelineGroupsOptions {
  readonly name: string;
  readonly stageIds: string[];
}

interface UpdatePipelineGroupOptions {
  readonly name?: string;
  readonly stageIds?: string[];
}

interface PipelineViewOptions {
  readonly name: string;
  readonly order: number;
  readonly isDefault?: boolean;
  readonly icon?: string;
  readonly columns: {
    name: string;
    stageIds: string[];
    flat?: boolean;
    backgroundColor?: string;
    color?: string;
  }[];
}

interface UpdatePipelineViewOptions {
  readonly name?: string;
  readonly order?: number;
  readonly icon?: string;
  readonly isDefault?: boolean;
  readonly columns?: {
    readonly name?: string;
    readonly stageIds?: string[];
    readonly flat?: boolean;
    readonly backgroundColor?: string;
    readonly color?: string;
  }[];
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
    @InjectRepository(PipelineViewEntity)
    private readonly pipelineViewRepository: Repository<PipelineViewEntity>,
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
      pipelineStage.relatedCompanyStatus = stage.relatedCompanyStatus || null;

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

  public async deletePipelineView(
    pipelineViewEntity: PipelineViewEntity,
  ): Promise<void> {
    await this.pipelineViewRepository.remove(pipelineViewEntity);
  }

  public async updatePipelineView(
    pipelineEntity: PipelineDefinitionEntity,
    pipelineViewEntity: PipelineViewEntity,
    options: UpdatePipelineViewOptions,
  ): Promise<PipelineViewEntity> {
    const updatedEntity = new PipelineViewEntity();
    updatedEntity.id = pipelineViewEntity.id;
    if (options.name) {
      updatedEntity.name = options.name;
    }

    if (options.order) {
      updatedEntity.order = options.order;
    }

    if (options.icon) {
      updatedEntity.icon = options.icon;
    }

    if (Object.prototype.hasOwnProperty.call(options, 'isDefault')) {
      updatedEntity.isDefault = !!options.isDefault;
    }

    if (options.columns?.length) {
      const columns = options.columns.map((c) => {
        return {
          name: c.name,
          stages: c.stageIds
            .filter((stageId) => {
              return pipelineEntity.stages.some((s) => s.id === stageId);
            })
            .map((id) => ({
              id,
            })),
          flat: c.flat || false,
          backgroundColor: c.backgroundColor,
          color: c.color,
        };
      });
      updatedEntity.columnsConfig = JSON.stringify(columns);
    }
    const savedEntity = await this.pipelineViewRepository.save(updatedEntity);

    return savedEntity;
  }

  public async getPipelineViews(
    pipelineDefinition: PipelineDefinitionEntity,
  ): Promise<PipelineViewEntity[]> {
    return await this.pipelineViewRepository
      .createQueryBuilder('pipelineView')
      .where('pipelineView.pipelineDefinitionId = :pipelineDefinitionId', {
        pipelineDefinitionId: pipelineDefinition.id,
      })
      .getMany();
  }

  public async createPipelineView(
    pipelineDefinition: PipelineDefinitionEntity,
    pipelineView: PipelineViewOptions,
  ): Promise<PipelineViewEntity> {
    const view = new PipelineViewEntity();
    view.name = pipelineView.name;
    view.order = pipelineView.order;
    view.pipelineDefinitionId = pipelineDefinition.id;
    view.isDefault = !!pipelineView.isDefault;
    view.icon = pipelineView.icon || '';
    const columns = pipelineView.columns.map((c) => {
      return {
        name: c.name,
        stages: c.stageIds
          .filter((stageId) => {
            return pipelineDefinition.stages.some((s) => s.id === stageId);
          })
          .map((id) => ({
            id,
          })),
        flat: c.flat || false,
        backgroundColor: c.backgroundColor,
        color: c.color,
      };
    });

    view.columnsConfig = JSON.stringify(columns);

    return await this.pipelineViewRepository.save(view);
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
    if (Object.prototype.hasOwnProperty.call(options, 'relatedCompanyStatus')) {
      pipelineStageEntity.relatedCompanyStatus = options.relatedCompanyStatus;
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
    pipelineStage.relatedCompanyStatus = options.relatedCompanyStatus || null;

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
    views?: PipelineViewEntity[],
  ): PipelineDefinitionData {
    return {
      id: entity.id,
      name: entity.name,
      isDefault: entity.isDefault,
      stages: entity.stages?.map((stage) =>
        this.pipelineStageEntityToData(stage),
      ),
      groups: groups?.map((group) => this.pipelineGroupEntityToData(group)),
      views: views?.map((view) => this.pipelineViewEntityToData(view)),
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
      isDefault: entity.isDefault || false,
      relatedCompanyStatus: entity.relatedCompanyStatus,
    };
  }

  public pipelineGroupsEntityToGroupingData(
    pipelineEntity: PipelineDefinitionEntity,
    groups: PipelineGroupEntity[],
  ): PipelineGroupingData {
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

  public pipelineViewEntityToData(view: PipelineViewEntity): PipelineViewData {
    return {
      id: view.id,
      name: view.name,
      order: view.order,
      isDefault: view.isDefault,
      icon: view.icon ?? '',
      columns: JSON.parse(view.columnsConfig || '[]')?.map((col) => {
        return {
          id: col.id,
          name: col.name,
          stageIds: col.stages.map((stage) => stage.id),
          flat: !!col.flat,
          color: col.color ?? null,
          backgroundColor: col.backgroundColor ?? null,
        };
      }),
    };
  }

  public pipelineViewEntitiesToViewsData(
    pipelineEntity: PipelineDefinitionEntity,
    views: PipelineViewEntity[],
  ): PipelineViewsData {
    return {
      pipelineId: pipelineEntity.id,
      views: views.map((v) => this.pipelineViewEntityToData(v)),
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
