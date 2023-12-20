import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { AbstractComparer } from './comparer';
import {
  AddedRemovedChange,
  BaseChange,
  ChangeType,
  ModifiedChange,
} from './dto/change.dto';
import { PipelineDefinitionStaticData } from './dto/pipeline-definition.static-data.dto';
import { PipelineStageStaticData } from './dto/pipeline-stage.static-data.dto';

@Injectable()
export class PipelineStaticDataService {
  public constructor(
    private readonly entityManager: EntityManager,
    private readonly pipelineDefinitionComparer: AbstractComparer<PipelineDefinitionStaticData>,
    private readonly pipelineStageComparer: AbstractComparer<PipelineStageStaticData>,
  ) {}

  public async getAllPipelineStaticData(): Promise<
    PipelineDefinitionStaticData[]
  > {
    const pipelines = await this.entityManager.find(PipelineDefinitionEntity, {
      relations: ['stages'],
    });
    return pipelines.map((pipeline) => {
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
      );
    });
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

    const changes = [
      ...pipelineDefinitionChanges,
      ...pipelineStageChanges,
    ] as BaseChange[];

    this.pipelineDefinitionComparer.unsetNestedProperties(changes);
    this.pipelineStageComparer.unsetNestedProperties(changes);
    return changes;
  }

  public async applyPipelineStaticData(changes: BaseChange[]): Promise<void> {
    const pipelineDefinitionChanges = changes.filter(
      (change) => change.entityClass === 'PipelineDefinitionEntity',
    );

    const pipelineStageChanges = changes.filter(
      (change) => change.entityClass === 'PipelineStageEntity',
    );

    await this.applyPipelineDefinitionChanges(pipelineDefinitionChanges);
    await this.applyPipelineStageChanges(pipelineStageChanges);
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
}
