import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { FieldDefinitionEntity } from '../rvn-templates/entities/field-definition.entity';
import { FieldGroupEntity } from '../rvn-templates/entities/field-group.entity';
import { TabEntity } from '../rvn-templates/entities/tab.entity';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { AbstractComparer } from './comparer';
import {
  AddedRemovedChange,
  BaseChange,
  ChangeType,
  ModifiedChange,
} from './dto/change.dto';
import { FieldDefinitionStaticData } from './dto/field-definition.static-data.dto';
import { FieldGroupStaticData } from './dto/field-group.static-data.dto';
import { TabStaticData } from './dto/tab.static-data.dto';
import { TemplateStaticData } from './dto/template.static-data.dto';

@Injectable()
export class TemplateStaticDataService {
  public constructor(
    private readonly entityManager: EntityManager,
    private readonly templateComparer: AbstractComparer<TemplateStaticData>,
    private readonly fieldGroupComparer: AbstractComparer<FieldGroupStaticData>,
    private readonly fieldDefinitionComparer: AbstractComparer<FieldDefinitionStaticData>,
    private readonly tabComparer: AbstractComparer<TabStaticData>,
  ) {}

  public async getAllTemplateStaticData(): Promise<TemplateStaticData[]> {
    const templates = await this.entityManager.find(TemplateEntity, {
      relations: [
        'fieldGroups',
        'tabs',
        'fieldGroups.fieldDefinitions',
        'fieldGroups.fieldDefinitions.hideOnPipelineStages',
        'tabs.fieldGroups',
        'tabs.relatedFields',
        'tabs.relatedTemplates',
      ],
      order: {
        name: 'ASC',
        fieldGroups: {
          order: 'ASC',
          fieldDefinitions: {
            order: 'ASC',
            hideOnPipelineStages: {
              order: 'ASC',
            },
          },
        },
        tabs: {
          order: 'ASC',
          fieldGroups: {
            order: 'ASC',
          },
          relatedFields: {
            order: 'ASC',
          },
          relatedTemplates: {
            name: 'ASC',
          },
        },
      },
    });

    return templates.map((template) => {
      return new TemplateStaticData(
        template.id,
        template.name,
        template.type,
        template.isDefault,
        template.fieldGroups.map((fieldGroup) => {
          return new FieldGroupStaticData(
            fieldGroup.id,
            fieldGroup.name,
            fieldGroup.order,
            fieldGroup.tabId,
            fieldGroup.fieldDefinitions.map((field) => {
              return new FieldDefinitionStaticData(
                field.id,
                field.name,
                field.type,
                field.order,
                field.configuration,
                fieldGroup.id,
                field.hideOnPipelineStages?.map((stage) => {
                  return stage.id;
                }),
              );
            }),
            template.id,
          );
        }),
        template.tabs.map((tab) => {
          return new TabStaticData(
            tab.id,
            tab.name,
            tab.order,
            tab.pipelineStages.map((stage) => {
              return stage.id;
            }),
            tab.relatedFields.map((field) => {
              return field.id;
            }),
            tab.relatedTemplates.map((template) => {
              return template.id;
            }),
            template.id,
          );
        }),
      );
    });
  }

  public async compareExistingTemplateStaticData(
    templateStaticData: TemplateStaticData[],
  ): Promise<BaseChange[]> {
    const newTemplateStaticData = templateStaticData.map((template) => {
      return new TemplateStaticData(
        template.id,
        template.name,
        template.type,
        template.isDefault,
        template.fieldGroups.map((fieldGroup) => {
          return new FieldGroupStaticData(
            fieldGroup.id,
            fieldGroup.name,
            fieldGroup.order,
            fieldGroup.tab_id,
            fieldGroup.fieldDefinitions.map((field) => {
              return new FieldDefinitionStaticData(
                field.id,
                field.name,
                field.type,
                field.order,
                field.configuration,
                fieldGroup.id,
                field.hideOnPipelineStageIds,
              );
            }),
            template.id,
          );
        }),
        template.tabs.map((tab) => {
          return new TabStaticData(
            tab.id,
            tab.name,
            tab.order,
            tab.pipelineStageIds,
            tab.relatedFieldIds,
            tab.relatedTemplateIds,
            template.id,
          );
        }),
      );
    });

    const existingTemplateStaticData = await this.getAllTemplateStaticData();

    const templateChanges = await this.getTemplateChanges(
      existingTemplateStaticData,
      newTemplateStaticData,
    );

    const fieldGroupChanges = await this.getFieldGroupChanges(
      existingTemplateStaticData,
      newTemplateStaticData,
    );

    const fieldDefinitionChanges = await this.getFieldDefinitionChanges(
      existingTemplateStaticData,
      newTemplateStaticData,
    );

    const tabChanges = await this.getTabChanges(
      existingTemplateStaticData,
      newTemplateStaticData,
    );

    this.tabComparer.unsetNestedProperties(tabChanges);
    this.fieldDefinitionComparer.unsetNestedProperties(fieldDefinitionChanges);
    this.fieldGroupComparer.unsetNestedProperties(fieldGroupChanges);
    this.templateComparer.unsetNestedProperties(templateChanges);

    return [
      ...templateChanges,
      ...fieldGroupChanges,
      ...fieldDefinitionChanges,
      ...tabChanges,
    ];
  }

  public async applyTemplateStaticData(changes: BaseChange[]): Promise<void> {
    const templateChanges = changes.filter(
      (change) => change.entityClass === 'TemplateEntity',
    );

    const fieldGroupChanges = changes.filter(
      (change) => change.entityClass === 'FieldGroupEntity',
    );

    const fieldDefinitionChanges = changes.filter(
      (change) => change.entityClass === 'FieldDefinitionEntity',
    );

    const tabChanges = changes.filter(
      (change) => change.entityClass === 'TabEntity',
    );

    await this.applyTemplateChanges(templateChanges);
    await this.applyFieldGroupChanges(fieldGroupChanges);
    await this.applyFieldDefinitionChanges(fieldDefinitionChanges);
    await this.applyTabChanges(tabChanges);
  }

  private async getTemplateChanges(
    existingTemplateStaticData: TemplateStaticData[],
    newTemplateStaticData: TemplateStaticData[],
  ): Promise<BaseChange[]> {
    return this.templateComparer.compareMany(
      existingTemplateStaticData,
      newTemplateStaticData,
    );
  }

  private async getFieldGroupChanges(
    existingTemplateStaticData: TemplateStaticData[],
    newTemplateStaticData: TemplateStaticData[],
  ): Promise<BaseChange[]> {
    return this.fieldGroupComparer.compareMany(
      existingTemplateStaticData.flatMap((template) => template.fieldGroups),
      newTemplateStaticData.flatMap((template) => template.fieldGroups),
    );
  }

  private async getFieldDefinitionChanges(
    existingTemplateStaticData: TemplateStaticData[],
    newTemplateStaticData: TemplateStaticData[],
  ): Promise<BaseChange[]> {
    return this.fieldDefinitionComparer.compareMany(
      existingTemplateStaticData
        .flatMap((template) => template.fieldGroups)
        .flatMap((fieldGroup) => fieldGroup.fieldDefinitions),
      newTemplateStaticData
        .flatMap((template) => template.fieldGroups)
        .flatMap((fieldGroup) => fieldGroup.fieldDefinitions),
    );
  }

  private async getTabChanges(
    existingTemplateStaticData: TemplateStaticData[],
    newTemplateStaticData: TemplateStaticData[],
  ): Promise<BaseChange[]> {
    return this.tabComparer.compareMany(
      existingTemplateStaticData.flatMap((template) => template.tabs),
      newTemplateStaticData.flatMap((template) => template.tabs),
    );
  }

  private async applyTemplateChanges(changes: BaseChange[]): Promise<void> {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      for (const change of changes.filter(
        (change) => change.changeType === ChangeType.Modified,
      )) {
        const modifiedChange = change as ModifiedChange<TemplateStaticData>;
        await transactionalEntityManager.update(
          TemplateEntity,
          modifiedChange.newData.id,
          {
            name: modifiedChange.newData.name,
            type: modifiedChange.newData.type,
            isDefault: modifiedChange.newData.isDefault,
          },
        );
      }

      for (const change of changes.filter(
        (change) => change.changeType !== ChangeType.Modified,
      )) {
        const addedRemovedChange =
          change as AddedRemovedChange<TemplateStaticData>;
        const data = addedRemovedChange.data as TemplateStaticData;
        switch (change.changeType) {
          case ChangeType.Added:
            await transactionalEntityManager.insert(TemplateEntity, {
              id: data.id,
              name: data.name,
              type: data.type,
              isDefault: data.isDefault,
              version: 1,
            });
            break;
          case ChangeType.Removed:
            await transactionalEntityManager.delete(TemplateEntity, data.id);
            break;
        }
      }
    });
  }

  private async applyFieldGroupChanges(changes: BaseChange[]): Promise<void> {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      for (const change of changes.filter(
        (change) => change.changeType === ChangeType.Modified,
      )) {
        const modifiedChange = change as ModifiedChange<FieldGroupStaticData>;
        await transactionalEntityManager.update(
          FieldGroupEntity,
          modifiedChange.newData.id,
          {
            name: modifiedChange.newData.name,
            order: modifiedChange.newData.order,
            tabId: modifiedChange.newData.tab_id,
          },
        );
      }

      for (const change of changes.filter(
        (change) => change.changeType !== ChangeType.Modified,
      )) {
        const addedRemovedChange =
          change as AddedRemovedChange<FieldGroupStaticData>;
        const data = addedRemovedChange.data as FieldGroupStaticData;
        switch (change.changeType) {
          case ChangeType.Added:
            await transactionalEntityManager.insert(FieldGroupEntity, {
              id: data.id,
              name: data.name,
              order: data.order,
              tabId: data.tab_id,
              templateId: data.templateId,
            });
            break;
          case ChangeType.Removed:
            await transactionalEntityManager.delete(FieldGroupEntity, data.id);
            break;
        }
      }
    });
  }

  private async applyFieldDefinitionChanges(
    changes: BaseChange[],
  ): Promise<void> {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      for (const change of changes.filter(
        (change) => change.changeType === ChangeType.Modified,
      )) {
        const modifiedChange =
          change as ModifiedChange<FieldDefinitionStaticData>;
        await transactionalEntityManager.update(
          FieldDefinitionEntity,
          modifiedChange.newData.id,
          {
            name: modifiedChange.newData.name,
            type: modifiedChange.newData.type,
            order: modifiedChange.newData.order,
            configuration: modifiedChange.newData.configuration,
            groupId: modifiedChange.newData.fieldGroupId,
          },
        );

        await transactionalEntityManager.query(
          `DELETE FROM rvn_field_hide_pipeline_stage WHERE field_id = @0`,
          [modifiedChange.newData.id],
        );
        if (
          modifiedChange.newData.hideOnPipelineStageIds &&
          modifiedChange.newData.hideOnPipelineStageIds.length > 0
        ) {
          await transactionalEntityManager.query(
            this.prepareMultiparamQuery(
              `INSERT INTO rvn_field_hide_pipeline_stage (field_id, pipeline_stage_id) VALUES`,
              modifiedChange.newData.hideOnPipelineStageIds,
            ),
            this.prepareMultiparamQueryParameters(
              modifiedChange.newData.id,
              modifiedChange.newData.hideOnPipelineStageIds,
            ),
          );
        }
      }

      for (const change of changes.filter(
        (change) => change.changeType !== ChangeType.Modified,
      )) {
        const addedRemovedChange =
          change as AddedRemovedChange<FieldDefinitionStaticData>;
        const data = addedRemovedChange.data as FieldDefinitionStaticData;
        switch (change.changeType) {
          case ChangeType.Added:
            await transactionalEntityManager.insert(FieldDefinitionEntity, {
              id: data.id,
              name: data.name,
              type: data.type,
              order: data.order,
              configuration: data.configuration,
              groupId: data.fieldGroupId,
            });
            if (
              data.hideOnPipelineStageIds &&
              data.hideOnPipelineStageIds.length > 0
            ) {
              await transactionalEntityManager.query(
                this.prepareMultiparamQuery(
                  `INSERT INTO rvn_field_hide_pipeline_stage (field_id, pipeline_stage_id) VALUES`,
                  data.hideOnPipelineStageIds,
                ),
                this.prepareMultiparamQueryParameters(
                  data.id,
                  data.hideOnPipelineStageIds,
                ),
              );
            }
            break;
          case ChangeType.Removed:
            await transactionalEntityManager.delete(
              FieldDefinitionEntity,
              data.id,
            );
            await transactionalEntityManager.query(
              `DELETE FROM rvn_field_hide_pipeline_stage WHERE field_id = @0`,
              [data.id],
            );
            break;
        }
      }
    });
  }

  private async applyTabChanges(changes: BaseChange[]): Promise<void> {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      for (const change of changes.filter(
        (change) => change.changeType === ChangeType.Modified,
      )) {
        const modifiedChange = change as ModifiedChange<TabStaticData>;
        await transactionalEntityManager.update(
          TabEntity,
          modifiedChange.newData.id,
          {
            name: modifiedChange.newData.name,
            order: modifiedChange.newData.order,
          },
        );
        await transactionalEntityManager.query(
          `DELETE FROM rvn_tab_pipeline_stage WHERE tab_id = @0`,
          [modifiedChange.newData.id],
        );
        await transactionalEntityManager.query(
          `DELETE FROM rvn_tab_related_field WHERE tab_id = @0`,
          [modifiedChange.newData.id],
        );
        await transactionalEntityManager.query(
          `DELETE FROM rvn_tab_related_template WHERE tab_id = @0`,
          [modifiedChange.newData.id],
        );

        if (
          modifiedChange.newData.pipelineStageIds &&
          modifiedChange.newData.pipelineStageIds.length > 0
        ) {
          await transactionalEntityManager.query(
            this.prepareMultiparamQuery(
              'INSERT INTO rvn_tab_pipeline_stage (tab_id, pipeline_stage_id) VALUES',
              modifiedChange.newData.pipelineStageIds,
            ),
            this.prepareMultiparamQueryParameters(
              modifiedChange.newData.id,
              modifiedChange.newData.pipelineStageIds,
            ),
          );
        }

        if (
          modifiedChange.newData.relatedFieldIds &&
          modifiedChange.newData.relatedFieldIds.length > 0
        ) {
          await transactionalEntityManager.query(
            this.prepareMultiparamQuery(
              `INSERT INTO rvn_tab_related_field (tab_id, field_definition_id) VALUES`,
              modifiedChange.newData.relatedFieldIds,
            ),
            this.prepareMultiparamQueryParameters(
              modifiedChange.newData.id,
              modifiedChange.newData.relatedFieldIds,
            ),
          );
        }

        if (
          modifiedChange.newData.relatedTemplateIds &&
          modifiedChange.newData.relatedTemplateIds.length > 0
        ) {
          await transactionalEntityManager.query(
            this.prepareMultiparamQuery(
              `INSERT INTO rvn_tab_related_template (tab_id, template_id) VALUES`,
              modifiedChange.newData.relatedTemplateIds,
            ),
            this.prepareMultiparamQueryParameters(
              modifiedChange.newData.id,
              modifiedChange.newData.relatedTemplateIds,
            ),
          );
        }
      }

      for (const change of changes.filter(
        (change) => change.changeType !== ChangeType.Modified,
      )) {
        const addedRemovedChange = change as AddedRemovedChange<TabStaticData>;
        const data = addedRemovedChange.data as TabStaticData;
        switch (change.changeType) {
          case ChangeType.Added:
            await transactionalEntityManager.insert(TabEntity, {
              id: data.id,
              name: data.name,
              order: data.order,
            });

            if (data.pipelineStageIds && data.pipelineStageIds.length > 0) {
              await transactionalEntityManager.query(
                this.prepareMultiparamQuery(
                  `INSERT INTO rvn_tab_pipeline_stage (tab_id, pipeline_stage_id) VALUES`,
                  data.pipelineStageIds,
                ),
                this.prepareMultiparamQueryParameters(
                  data.id,
                  data.pipelineStageIds,
                ),
              );
            }

            if (data.relatedFieldIds && data.relatedFieldIds.length > 0) {
              await transactionalEntityManager.query(
                this.prepareMultiparamQuery(
                  `INSERT INTO rvn_tab_related_field (tab_id, field_definition_id) VALUES`,
                  data.relatedFieldIds,
                ),
                this.prepareMultiparamQueryParameters(
                  data.id,
                  data.relatedFieldIds,
                ),
              );
            }

            if (data.relatedTemplateIds && data.relatedTemplateIds.length > 0) {
              await transactionalEntityManager.query(
                this.prepareMultiparamQuery(
                  `INSERT INTO rvn_tab_related_template (tab_id, template_id) VALUES`,
                  data.relatedTemplateIds,
                ),
                this.prepareMultiparamQueryParameters(
                  data.id,
                  data.relatedTemplateIds,
                ),
              );
            }
            break;
          case ChangeType.Removed:
            await transactionalEntityManager.query(
              `DELETE FROM rvn_tab_pipeline_stage WHERE tab_id = @0`,
              [data.id],
            );
            await transactionalEntityManager.query(
              `DELETE FROM rvn_tab_related_field WHERE tab_id = @0`,
              [data.id],
            );
            await transactionalEntityManager.query(
              `DELETE FROM rvn_tab_related_template WHERE tab_id = @0`,
              [data.id],
            );
            await transactionalEntityManager.delete(TabEntity, data.id);
            break;
        }
      }
    });
  }

  private prepareMultiparamQuery(baseQuery: string, ids: string[]): string {
    return `${baseQuery} ${ids
      .map((_, index) => `(@${index * 2}, @${index * 2 + 1})`)
      .join(',')}`;
  }

  private prepareMultiparamQueryParameters(
    singleId: string,
    ids: string[],
  ): string[] {
    return ids.reduce((acc, id) => acc.concat([singleId, id]), []);
  }
}
