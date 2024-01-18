import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineGroupEntity } from '../rvn-pipeline/entities/pipeline-group.entity';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { AbstractComparer } from './comparer';
import {
  AddedRemovedChange,
  BaseChange,
  ChangeType,
  ModifiedChange,
} from './dto/change.dto';
import { PipelineDefinitionStaticData } from './dto/pipeline-definition.static-data.dto';
import { PipelineGroupStaticData } from './dto/pipeline-group.static-data.dto';
import { PipelineStageStaticData } from './dto/pipeline-stage.static-data.dto';
import { QueryUtils } from './query.utils';

@Injectable()
export class PipelineStaticDataService {
  public constructor(
    private readonly entityManager: EntityManager,
    private readonly pipelineDefinitionComparer: AbstractComparer<PipelineDefinitionStaticData>,
    private readonly pipelineStageComparer: AbstractComparer<PipelineStageStaticData>,
    private readonly pipelineGroupComparer: AbstractComparer<PipelineGroupStaticData>,
  ) {}

  public async getAllPipelineStaticData(): Promise<
    PipelineDefinitionStaticData[]
  > {
    const pipelines = await this.entityManager.find(PipelineDefinitionEntity, {
      relations: ['stages'],
    });

    return Promise.all(
      pipelines.map(async (pipeline) => {
        const groupsForPipeline = await this.entityManager
          .createQueryBuilder(PipelineGroupEntity, 'pipelineGroup')
          .innerJoinAndSelect('pipelineGroup.stages', 'stage')
          .where('stage.pipelineDefinitionId = :pipelineDefinitionId', {
            pipelineDefinitionId: pipeline.id,
          })
          .getMany();
        return new PipelineDefinitionStaticData(
          pipeline.id,
          pipeline.name,
          pipeline.isDefault,
          pipeline.affinityListId,
          pipeline.affinityStatusFieldId,
          pipeline.stages.map((stage) => {
            return new PipelineStageStaticData(
              stage.id,
              stage.displayName,
              stage.order,
              stage.mappedFrom,
            );
          }),
          groupsForPipeline.map((group) => {
            return new PipelineGroupStaticData(
              group.id,
              group.groupName,
              group.stages.map((stage) => stage.id),
            );
          }),
        );
      }),
    );
  }

  public async compareExistingPipelineStaticData(
    pipelineStaticData: PipelineDefinitionStaticData[],
  ): Promise<BaseChange[]> {
    const newPipelineStaticData = pipelineStaticData.map((pipeline) => {
      return new PipelineDefinitionStaticData(
        pipeline.id,
        pipeline.name,
        pipeline.isDefault,
        pipeline.affinityListId,
        pipeline.affinityStatusFieldId,
        pipeline.pipelineStages.map((stage) => {
          return new PipelineStageStaticData(
            stage.id,
            stage.displayName,
            stage.order,
            stage.mappedFrom,
          );
        }),
        pipeline.pipelineGroups.map((group) => {
          return new PipelineGroupStaticData(
            group.id,
            group.groupName,
            group.stageIds,
          );
        }),
      );
    });

    const existingPipelineStaticData = await this.getAllPipelineStaticData();

    const pipelineDefinitionChanges = await this.getPipelineDefinitionChanges(
      existingPipelineStaticData,
      newPipelineStaticData,
    );

    const pipelineStageChanges = await this.getPipelineStageChanges(
      existingPipelineStaticData,
      newPipelineStaticData,
    );

    const pipelineGroupChanges = await this.getPipelineGroupChanges(
      existingPipelineStaticData,
      newPipelineStaticData,
    );

    const changes = [
      ...pipelineDefinitionChanges,
      ...pipelineStageChanges,
      ...pipelineGroupChanges,
    ] as BaseChange[];

    this.pipelineDefinitionComparer.unsetNestedProperties(changes);
    this.pipelineStageComparer.unsetNestedProperties(changes);
    this.pipelineGroupComparer.unsetNestedProperties(changes);
    return changes;
  }

  public async applyPipelineStaticData(changes: BaseChange[]): Promise<void> {
    const pipelineDefinitionChanges = changes.filter(
      (change) => change.entityClass === 'PipelineDefinitionEntity',
    );

    const pipelineStageChanges = changes.filter(
      (change) => change.entityClass === 'PipelineStageEntity',
    );

    const pipelineGroupChanges = changes.filter(
      (change) => change.entityClass === 'PipelineGroupEntity',
    );

    await this.applyPipelineDefinitionChanges(pipelineDefinitionChanges);
    await this.applyPipelineStageChanges(pipelineStageChanges);
    await this.applyPipelineGroupChanges(pipelineGroupChanges);
  }

  private async getPipelineDefinitionChanges(
    existingPipelineStaticData: PipelineDefinitionStaticData[],
    pipelineStaticData: PipelineDefinitionStaticData[],
  ): Promise<BaseChange[]> {
    const changes: BaseChange[] = [];

    const pipelineDefinitionChanges =
      this.pipelineDefinitionComparer.compareMany(
        existingPipelineStaticData,
        pipelineStaticData,
      );

    changes.push(...pipelineDefinitionChanges);

    return changes;
  }

  private async getPipelineStageChanges(
    existingPipelineStaticData: PipelineDefinitionStaticData[],
    pipelineStaticData: PipelineDefinitionStaticData[],
  ): Promise<BaseChange[]> {
    const changes: BaseChange[] = [];

    const pipelineStageChanges = this.pipelineStageComparer.compareMany(
      existingPipelineStaticData.flatMap((pipeline) => pipeline.pipelineStages),
      pipelineStaticData.flatMap((pipeline) => pipeline.pipelineStages),
    );

    changes.push(...pipelineStageChanges);

    return changes;
  }

  private async getPipelineGroupChanges(
    existingPipelineStaticData: PipelineDefinitionStaticData[],
    pipelineStaticData: PipelineDefinitionStaticData[],
  ): Promise<BaseChange[]> {
    const changes: BaseChange[] = [];

    const pipelineGroupChanges = this.pipelineGroupComparer.compareMany(
      existingPipelineStaticData.flatMap((pipeline) => pipeline.pipelineGroups),
      pipelineStaticData.flatMap((pipeline) => pipeline.pipelineGroups),
    );

    changes.push(...pipelineGroupChanges);

    return changes;
  }

  private async applyPipelineDefinitionChanges(
    changes: BaseChange[],
  ): Promise<void> {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      for (const change of changes.filter(
        (change) => change.changeType === ChangeType.Modified,
      )) {
        const modifiedChange =
          change as ModifiedChange<PipelineDefinitionStaticData>;
        await transactionalEntityManager.update(
          PipelineDefinitionEntity,
          modifiedChange.newData.id,
          {
            name: modifiedChange.newData.name,
            isDefault: modifiedChange.newData.isDefault,
            affinityListId: modifiedChange.newData.affinityListId,
            affinityStatusFieldId: modifiedChange.newData.affinityStatusFieldId,
          },
        );
      }

      for (const change of changes.filter(
        (change) => change.changeType !== ChangeType.Modified,
      )) {
        const addedRemovedChange =
          change as AddedRemovedChange<PipelineDefinitionStaticData>;
        const data = addedRemovedChange.data as PipelineDefinitionStaticData;
        switch (change.changeType) {
          case ChangeType.Added:
            await transactionalEntityManager.insert(PipelineDefinitionEntity, {
              id: data.id,
              name: data.name,
              isDefault: data.isDefault,
              affinityListId: data.affinityListId,
              affinityStatusFieldId: data.affinityStatusFieldId,
            });
            break;
          case ChangeType.Removed:
            await transactionalEntityManager.delete(
              PipelineDefinitionEntity,
              data.id,
            );
            break;
        }
      }
    });
  }

  private async applyPipelineStageChanges(
    changes: BaseChange[],
  ): Promise<void> {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      for (const change of changes.filter(
        (change) => change.changeType === ChangeType.Modified,
      )) {
        const modifiedChange =
          change as ModifiedChange<PipelineStageStaticData>;
        await transactionalEntityManager.update(
          PipelineStageEntity,
          modifiedChange.newData.id,
          {
            displayName: modifiedChange.newData.displayName,
            order: modifiedChange.newData.order,
            mappedFrom: modifiedChange.newData.mappedFrom,
          },
        );
      }

      for (const change of changes.filter(
        (change) => change.changeType !== ChangeType.Modified,
      )) {
        const addedRemovedChange =
          change as AddedRemovedChange<PipelineStageStaticData>;
        const data = addedRemovedChange.data as PipelineStageStaticData;
        switch (change.changeType) {
          case ChangeType.Added:
            await transactionalEntityManager.insert(PipelineStageEntity, {
              id: data.id,
              displayName: data.displayName,
              order: data.order,
              mappedFrom: data.mappedFrom,
            });
            break;
          case ChangeType.Removed:
            await transactionalEntityManager.delete(
              PipelineStageEntity,
              data.id,
            );
            break;
        }
      }
    });
  }
  private async applyPipelineGroupChanges(
    changes: BaseChange[],
  ): Promise<void> {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      for (const change of changes.filter(
        (change) => change.changeType === ChangeType.Modified,
      )) {
        const modifiedChange =
          change as ModifiedChange<PipelineGroupStaticData>;
        await transactionalEntityManager.update(
          PipelineGroupEntity,
          modifiedChange.newData.id,
          {
            groupName: modifiedChange.newData.groupName,
          },
        );
        await transactionalEntityManager.query(
          `DELETE FROM rvn_pipeline_stage_groups WHERE pipeline_stage_group_id = @0`,
          [modifiedChange.newData.id],
        );
        if (
          modifiedChange.newData.stageIds &&
          modifiedChange.newData.stageIds.length > 0
        ) {
          await transactionalEntityManager.query(
            QueryUtils.prepareMultiparamQuery(
              `INSERT INTO rvn_pipeline_stage_groups (pipeline_stage_group_id, pipeline_stage_id) VALUES`,
              modifiedChange.newData.stageIds,
            ),
            QueryUtils.prepareMultiparamQueryParameters(
              modifiedChange.newData.id,
              modifiedChange.newData.stageIds,
            ),
          );
        }
      }

      for (const change of changes.filter(
        (change) => change.changeType !== ChangeType.Modified,
      )) {
        const addedRemovedChange =
          change as AddedRemovedChange<PipelineGroupStaticData>;
        const data = addedRemovedChange.data as PipelineGroupStaticData;
        switch (change.changeType) {
          case ChangeType.Added:
            await transactionalEntityManager.insert(PipelineGroupEntity, {
              id: data.id,
              groupName: data.groupName,
            });
            if (data.stageIds && data.stageIds.length > 0) {
              await transactionalEntityManager.query(
                QueryUtils.prepareMultiparamQuery(
                  `INSERT INTO rvn_pipeline_stage_groups (pipeline_stage_group_id, pipeline_stage_id) VALUES`,
                  data.stageIds,
                ),
                QueryUtils.prepareMultiparamQueryParameters(
                  data.id,
                  data.stageIds,
                ),
              );
            }
            break;
          case ChangeType.Removed:
            await transactionalEntityManager.delete(
              PipelineGroupEntity,
              data.id,
            );
            break;
        }
      }
    });
  }
}
