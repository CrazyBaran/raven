import {
  FieldDefinitionData,
  FieldDefinitionType,
  FieldGroupsWithDefinitionsData,
  TemplateData,
  TemplateTypeEnum,
  TemplateWithRelationsData,
} from '@app/rvns-templates';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TabData } from '../../../../../../libs/rvns-templates/src/lib/data/tab-data.interface';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { FieldDefinitionEntity } from './entities/field-definition.entity';
import { FieldGroupEntity } from './entities/field-group.entity';
import { TabEntity } from './entities/tab.entity';
import { TemplateEntity } from './entities/template.entity';

interface CreateTemplateOptions {
  name: string;
  type: TemplateTypeEnum;
  userEntity: UserEntity;
}

interface CreateFieldGroupOptions {
  name: string;
  order: number;
  templateId: string;
  tabId?: string;
  userEntity: UserEntity;
}

interface CreateTabOptions {
  name: string;
  order: number;
  templateId: string;
  userEntity: UserEntity;
}

interface UpdateFieldGroupOptions {
  name?: string;
  order?: number;
}

interface CreateFieldDefinitionOptions {
  name: string;
  order: number;
  type: FieldDefinitionType;
  groupId: string;
  userEntity: UserEntity;
}

interface UpdateFieldDefinitionOptions {
  name: string;
  order: number;
  type: FieldDefinitionType;
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

  public async list(): Promise<TemplateEntity[]> {
    return this.templatesRepository.find();
  }

  public async createTemplate(
    options: CreateTemplateOptions,
  ): Promise<TemplateEntity> {
    const templateEntity = new TemplateEntity();
    templateEntity.name = options.name;
    templateEntity.type = options.type;
    templateEntity.version = 1; // TODO versioning on update will be handled later?
    templateEntity.createdBy = options.userEntity;
    return this.templatesRepository.save(templateEntity);
  }

  public async updateTemplate(
    templateEntity: TemplateEntity,
    dto: UpdateTemplateDto,
  ): Promise<TemplateEntity> {
    delete templateEntity.fieldGroups;
    templateEntity.name = dto.name;
    return this.templatesRepository.save(templateEntity);
  }

  public async removeTemplate(templateEntity: TemplateEntity): Promise<void> {
    await this.templatesRepository.remove(templateEntity);
  }

  public async createFieldGroup(
    options: CreateFieldGroupOptions,
  ): Promise<FieldGroupEntity> {
    const fieldGroupEntity = new FieldGroupEntity();
    fieldGroupEntity.name = options.name;
    fieldGroupEntity.order = options.order;
    if (options.tabId) {
      fieldGroupEntity.tabId = options.tabId;
    }
    fieldGroupEntity.template = { id: options.templateId } as TemplateEntity;
    fieldGroupEntity.createdBy = options.userEntity;
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
    const tab = new TabEntity();
    tab.name = options.name;
    tab.order = options.order;
    tab.template = { id: options.templateId } as TemplateEntity;
    tab.createdBy = options.userEntity;
    return this.tabsRepository.save(tab);
  }

  public async createFieldDefinition(
    options: CreateFieldDefinitionOptions,
  ): Promise<FieldDefinitionEntity> {
    const fieldDefinitionEntity = new FieldDefinitionEntity();
    fieldDefinitionEntity.name = options.name;
    fieldDefinitionEntity.order = options.order;
    fieldDefinitionEntity.type = options.type;
    fieldDefinitionEntity.group = { id: options.groupId } as FieldGroupEntity;
    fieldDefinitionEntity.createdBy = options.userEntity;
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
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
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
      fieldDefinitions: entity.fieldDefinitions?.map(
        this.fieldDefinitionEntityToFieldDefinitionData.bind(this),
      ),
      templateId: entity.templateId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
    };
  }
  public tabEntityToTabData(entity: TabEntity): TabData {
    return {
      id: entity.id,
      name: entity.name,
      order: entity.order,
      templateId: entity.templateId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
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
      createdById: entity.createdById,
    };
  }

  public templateWithRelationsToTemplateWithRelationsData(
    template: TemplateEntity,
  ): TemplateWithRelationsData {
    return {
      id: template.id,
      name: template.name,
      type: template.type as TemplateTypeEnum,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      createdById: template.createdById,
      tabs: template.tabs.map((tab) => ({
        id: tab.id,
        name: tab.name,
        order: tab.order,
        templateId: tab.templateId,
        createdAt: tab.createdAt,
        updatedAt: tab.updatedAt,
        createdById: tab.createdById,
        fieldGroups: tab.fieldGroups?.map(
          this.fieldGroupEntityToFieldGroupData.bind(this),
        ),
      })),
      fieldGroups: template.fieldGroups?.map(
        this.fieldGroupEntityToFieldGroupData.bind(this),
      ),
    };
  }
}
