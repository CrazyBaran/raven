import { TagTypeEnum } from '@app/rvns-tags';
import {
  FieldDefinitionData,
  FieldDefinitionType,
  FieldGroupsWithDefinitionsData,
  TabWithFieldGroupsData,
  TemplateData,
  TemplateTypeEnum,
  TemplateWithRelationsData,
} from '@app/rvns-templates';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { TabTagEntity } from '../rvn-tags/entities/tag.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { FieldDefinitionEntity } from './entities/field-definition.entity';
import { FieldGroupEntity } from './entities/field-group.entity';
import { TabEntity } from './entities/tab.entity';
import { TemplateEntity } from './entities/template.entity';

interface CreateTemplateOptions {
  name: string;
  type: TemplateTypeEnum;
  isDefault: boolean;
  userEntity: UserEntity;
}

interface UpdateTemplateOptions {
  name?: string;
  isDefault?: boolean;
}

interface CreateFieldGroupOptions {
  name: string;
  order: number;
  templateId: string;
  tab: TabEntity | null;
  userEntity: UserEntity;
}

interface CreateTabOptions {
  name: string;
  order: number;
  template: TemplateEntity;
  userEntity: UserEntity;
  pipelineStages: PipelineStageEntity[] | null;
  relatedFieldDefinitions: FieldDefinitionEntity[] | null;
  relatedTemplates: TemplateEntity[] | null;
}

interface UpdateFieldGroupOptions {
  name?: string;
  order?: number;
}

interface UpdateTabOptions {
  name?: string;
  order?: number;
  pipelineStages: PipelineStageEntity[] | null;
  relatedFieldDefinitions: FieldDefinitionEntity[] | null;
  relatedTemplates: TemplateEntity[] | null;
}

interface CreateFieldDefinitionOptions extends UpdateFieldDefinitionOptions {
  groupId: string;
  userEntity: UserEntity;
}

interface UpdateFieldDefinitionOptions {
  name: string;
  order: number;
  type: FieldDefinitionType;
  configuration?: string;
}

@Injectable()
export class TemplatesService {
  public constructor(
    @InjectRepository(TemplateEntity)
    private readonly templatesRepository: Repository<TemplateEntity>,
    @InjectRepository(TabEntity)
    private readonly tabsRepository: Repository<TabEntity>,
    @InjectRepository(FieldGroupEntity)
    private readonly fieldGroupsRepository: Repository<FieldGroupEntity>,
    @InjectRepository(FieldDefinitionEntity)
    private readonly fieldDefinitionsRepository: Repository<FieldDefinitionEntity>,
  ) {}

  public async list(type?: TemplateTypeEnum): Promise<TemplateEntity[]> {
    return this.templatesRepository.find({
      where: type ? { type } : {},
      relations: [
        'tabs',
        'tabs.fieldGroups',
        'tabs.fieldGroups.fieldDefinitions',
        'tabs.relatedFields',
        'tabs.relatedTemplates',
        'fieldGroups',
        'fieldGroups.fieldDefinitions',
      ],
    });
  }

  public async createTemplate(
    options: CreateTemplateOptions,
  ): Promise<TemplateEntity> {
    if (options.isDefault) {
      const defaultTemplate = await this.templatesRepository.findOne({
        where: { isDefault: true, type: options.type },
      });
      if (defaultTemplate) {
        throw new BadRequestException(
          'Only one default template per type is allowed',
        );
      }
    }
    const templateEntity = new TemplateEntity();
    templateEntity.name = options.name;
    templateEntity.type = options.type;
    templateEntity.isDefault = options.isDefault;
    templateEntity.version = 1; // TODO versioning on update will be handled later?
    return this.templatesRepository.save(templateEntity);
  }

  public async updateTemplate(
    templateEntity: TemplateEntity,
    options: UpdateTemplateOptions,
  ): Promise<TemplateEntity> {
    delete templateEntity.fieldGroups;
    delete templateEntity.tabs;
    if (options.name) {
      templateEntity.name = options.name;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'isDefault')) {
      const defaultTemplate = await this.templatesRepository.findOne({
        where: { isDefault: true, type: templateEntity.type },
      });
      if (defaultTemplate && options.isDefault) {
        throw new BadRequestException('Only one default template is allowed');
      }
      templateEntity.isDefault = options.isDefault;
    }
    return this.templatesRepository.save(templateEntity);
  }

  public async removeTemplate(templateEntity: TemplateEntity): Promise<void> {
    await this.templatesRepository.manager.transaction(async (manager) => {
      for (const tab of templateEntity.tabs) {
        tab.pipelineStages = [];
        tab.relatedFields = [];
        tab.relatedTemplates = [];

        await manager.save(tab);
      }
      await manager.remove(templateEntity);
    });
  }

  public async createFieldGroup(
    options: CreateFieldGroupOptions,
  ): Promise<FieldGroupEntity> {
    const fieldGroupEntity = new FieldGroupEntity();
    fieldGroupEntity.name = options.name;
    fieldGroupEntity.order = options.order;
    if (options.tab) {
      fieldGroupEntity.tab = options.tab;
    }
    fieldGroupEntity.template = { id: options.templateId } as TemplateEntity;
    return this.fieldGroupsRepository.save(fieldGroupEntity);
  }

  public async updateFieldGroup(
    fieldGroupEntity: FieldGroupEntity,
    options: UpdateFieldGroupOptions,
  ): Promise<FieldGroupEntity> {
    delete fieldGroupEntity.fieldDefinitions;
    if (options.name) {
      fieldGroupEntity.name = options.name;
    }
    if (options.order) {
      fieldGroupEntity.order = options.order;
    }
    return this.fieldGroupsRepository.save(fieldGroupEntity);
  }

  public async removeFieldGroup(
    group: FieldGroupEntity,
  ): Promise<FieldGroupEntity> {
    return this.fieldGroupsRepository.remove(group);
  }

  public async createTab(options: CreateTabOptions): Promise<TabEntity> {
    return this.tabsRepository.manager.transaction(async (tem) => {
      const tab = new TabEntity();
      tab.name = options.name;
      tab.order = options.order;
      tab.template = { id: options.template.id } as TemplateEntity;
      tab.pipelineStages = options.pipelineStages;
      tab.relatedFields = options.relatedFieldDefinitions;
      tab.relatedTemplates = options.relatedTemplates;
      const savedTab = await tem.save(tab);

      if (options.template.type === TemplateTypeEnum.Workflow) {
        const tabTag = new TabTagEntity();
        tabTag.name = options.name;
        tabTag.type = TagTypeEnum.Tab;
        tabTag.tabId = savedTab.id;
        await tem.save(TabTagEntity, tabTag);
      }
      return savedTab;
    });
  }

  public async updateTab(
    tab: TabEntity,
    options: UpdateTabOptions,
  ): Promise<TabEntity> {
    return await this.tabsRepository.manager.transaction(async (tem) => {
      delete tab.fieldGroups;

      if (options.name) {
        tab.name = options.name;
      }
      if (options.order) {
        tab.order = options.order;
      }
      if (options.pipelineStages) {
        await tem
          .createQueryBuilder()
          .relation(TabEntity, 'pipelineStages')
          .of(tab)
          .addAndRemove(options.pipelineStages, tab.pipelineStages);
      }
      if (options.relatedFieldDefinitions) {
        await tem
          .createQueryBuilder()
          .relation(TabEntity, 'relatedFields')
          .of(tab)
          .addAndRemove(options.relatedFieldDefinitions, tab.relatedFields);
      }
      if (options.relatedTemplates) {
        await tem
          .createQueryBuilder()
          .relation(TabEntity, 'relatedTemplates')
          .of(tab)
          .addAndRemove(options.relatedTemplates, tab.relatedTemplates);
      }
      const oldRelatedFields = tab.relatedFields;
      const oldPipelineStages = tab.pipelineStages;
      const oldRelatedTemplates = tab.relatedTemplates;
      delete tab.relatedFields;
      delete tab.pipelineStages;
      delete tab.relatedTemplates;

      await tem.save(tab);

      if (tab.template.type === TemplateTypeEnum.Workflow && options.name) {
        const relatedTag = await tem.findOne(TabTagEntity, {
          where: { tabId: tab.id },
        });
        if (!relatedTag) {
          throw new Error('Tab tag not found');
        }
        relatedTag.name = `${tab.template.name} - ${options.name}`;
        await tem.save(relatedTag);
      }

      // we reassign those here because of the way TypeORM handles relations
      tab.pipelineStages = options.pipelineStages || oldPipelineStages;
      tab.relatedFields = options.relatedFieldDefinitions || oldRelatedFields;
      tab.relatedTemplates = options.relatedTemplates || oldRelatedTemplates;
      return tab;
    });
  }

  public async removeTab(tab: TabEntity): Promise<void> {
    await this.tabsRepository.manager.transaction(async (manager) => {
      for (const group of tab.fieldGroups) {
        await manager.remove(group.fieldDefinitions);
      }
      await manager.remove(tab.fieldGroups);
      await manager.remove(tab);
    });
  }

  public async createFieldDefinition(
    options: CreateFieldDefinitionOptions,
  ): Promise<FieldDefinitionEntity> {
    const fieldDefinitionEntity = new FieldDefinitionEntity();
    fieldDefinitionEntity.name = options.name;
    fieldDefinitionEntity.order = options.order;
    fieldDefinitionEntity.type = options.type;
    fieldDefinitionEntity.group = { id: options.groupId } as FieldGroupEntity;
    fieldDefinitionEntity.configuration = options.configuration;
    return this.fieldDefinitionsRepository.save(fieldDefinitionEntity);
  }

  public async updateFieldDefinition(
    fieldDefinitionEntity: FieldDefinitionEntity,
    options: UpdateFieldDefinitionOptions,
  ): Promise<FieldDefinitionEntity> {
    if (options.name) {
      fieldDefinitionEntity.name = options.name;
    }
    if (options.order) {
      fieldDefinitionEntity.order = options.order;
    }
    if (options.type) {
      fieldDefinitionEntity.type = options.type;
    }
    if (options.configuration) {
      if (
        options.type !== FieldDefinitionType.Heatmap ||
        (!options.type &&
          fieldDefinitionEntity.type !== FieldDefinitionType.Heatmap)
      ) {
        throw new BadRequestException(
          'Invalid configuration for the given type.',
        );
      }
      fieldDefinitionEntity.configuration = options.configuration;
    }
    return this.fieldDefinitionsRepository.save(fieldDefinitionEntity);
  }

  public async removeFieldDefinition(
    fieldDefinitionEntity: FieldDefinitionEntity,
  ): Promise<void> {
    await this.fieldDefinitionsRepository.remove(fieldDefinitionEntity);
  }

  public templateEntityToTemplateData(entity: TemplateEntity): TemplateData {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type as TemplateTypeEnum,
      isDefault: entity.isDefault,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public templateEntitiesToTemplateData(
    entities: TemplateEntity[],
  ): TemplateData[] {
    return entities?.map(this.templateEntityToTemplateData.bind(this));
  }

  public fieldGroupEntityToFieldGroupData(
    entity: FieldGroupEntity,
  ): FieldGroupsWithDefinitionsData {
    return {
      id: entity.id,
      name: entity.name,
      order: entity.order,
      tabId: entity.tabId,
      tabName: entity.tab?.name,
      fieldDefinitions: entity.fieldDefinitions?.map(
        this.fieldDefinitionEntityToFieldDefinitionData.bind(this),
      ),
      templateId: entity.templateId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  public tabEntityToTabData(entity: TabEntity): TabWithFieldGroupsData {
    return {
      id: entity.id,
      name: entity.name,
      order: entity.order,
      fieldGroups: entity.fieldGroups?.map(
        this.fieldGroupEntityToFieldGroupData.bind(this),
      ),
      pipelineStages: entity.pipelineStages?.map((ps) => ({
        id: ps.id,
        displayName: ps.displayName,
      })),
      relatedFields: entity.relatedFields?.map((rf) => ({
        id: rf.id,
        name: rf.name,
      })),
      relatedTemplates: entity.relatedTemplates?.map((rf) => ({
        id: rf.id,
        name: rf.name,
      })),
      templateId: entity.templateId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public fieldDefinitionEntityToFieldDefinitionData(
    entity: FieldDefinitionEntity,
  ): FieldDefinitionData {
    return {
      id: entity.id,
      name: entity.name,
      order: entity.order,
      type: entity.type,
      fieldGroupId: entity.groupId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public templateWithRelationsToTemplateWithRelationsData(
    template: TemplateEntity,
  ): TemplateWithRelationsData {
    return {
      id: template.id,
      name: template.name,
      type: template.type as TemplateTypeEnum,
      isDefault: template.isDefault,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      tabs: template.tabs.map(this.tabEntityToTabData.bind(this)),
      fieldGroups: template.fieldGroups
        ?.filter((fg) => !fg.tabId)
        .map(this.fieldGroupEntityToFieldGroupData.bind(this)),
    };
  }
}
