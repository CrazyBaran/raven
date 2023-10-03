import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TemplateEntity } from './entities/template.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { UpdateTemplateDto } from './dto/update-template.dto';
import {
  FieldDefinitionData,
  FieldGroupData,
  TemplateData,
} from '@app/rvns-templates';
import { FieldGroupEntity } from './entities/field-group.entity';
import { FieldDefinitionEntity } from './entities/field-definition.entity';
import { FieldDefinitionType } from './enums/field-definition-type.enum';
import { InjectRepository } from '@nestjs/typeorm';

export interface CreateFieldGroupOptions {
  name: string;
  order: number;
  templateId: string;
  createdById: string;
}

export interface UpdateFieldGroupOptions {
  name?: string;
  order?: number;
}

export interface CreateFieldDefinitionOptions {
  name: string;
  order: number;
  type: FieldDefinitionType;
  groupId: string;
  createdById: string;
}

@Injectable()
export class TemplatesService {
  public constructor(
    @InjectRepository(TemplateEntity)
    private readonly templatesRepository: Repository<TemplateEntity>,
    @InjectRepository(FieldGroupEntity)
    private readonly fieldGroupsRepository: Repository<FieldGroupEntity>,
    @InjectRepository(FieldDefinitionEntity)
    private readonly fieldDefinitionsRepository: Repository<FieldDefinitionEntity>,
  ) {}

  public async list(): Promise<TemplateEntity[]> {
    return this.templatesRepository.find();
  }

  public async createTemplate(
    name: string,
    authorId: string,
  ): Promise<TemplateEntity> {
    const templateEntity = new TemplateEntity();
    templateEntity.name = name;
    templateEntity.createdBy = { id: authorId } as UserEntity;
    return this.templatesRepository.save(templateEntity);
  }

  public async updateTemplate(
    templateEntity: TemplateEntity,
    dto: UpdateTemplateDto,
  ): Promise<TemplateEntity> {
    templateEntity.name = dto.name;
    return this.templatesRepository.save(templateEntity);
  }

  public async createFieldGroup(
    options: CreateFieldGroupOptions,
  ): Promise<FieldGroupEntity> {
    const fieldGroupEntity = new FieldGroupEntity();
    fieldGroupEntity.name = options.name;
    fieldGroupEntity.order = options.order;
    fieldGroupEntity.template = { id: options.templateId } as TemplateEntity;
    return this.fieldGroupsRepository.save(fieldGroupEntity);
  }

  public async updateFieldGroup(
    fieldGroupEntity: FieldGroupEntity,
    options: UpdateFieldGroupOptions,
  ): Promise<FieldGroupEntity> {
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

  public async createFieldDefinition(
    options: CreateFieldDefinitionOptions,
  ): Promise<FieldDefinitionEntity> {
    const fieldDefinitionEntity = new FieldDefinitionEntity();
    fieldDefinitionEntity.name = options.name;
    fieldDefinitionEntity.order = options.order;
    fieldDefinitionEntity.type = options.type;
    fieldDefinitionEntity.group = { id: options.groupId } as FieldGroupEntity;
    return this.fieldDefinitionsRepository.save(fieldDefinitionEntity);
  }

  public templateEntityToTemplateData(entity: TemplateEntity): TemplateData {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
    };
  }

  public templateEntitiesToTemplateData(
    entities: TemplateEntity[],
  ): TemplateData[] {
    return entities.map((e) => this.templateEntityToTemplateData(e));
  }

  public fieldGroupEntityToFieldGroupData(
    entity: FieldGroupEntity,
  ): FieldGroupData {
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
}
