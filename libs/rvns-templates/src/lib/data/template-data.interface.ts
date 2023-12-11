import { TemplateTypeEnum } from '../enums/template-type.enum';
import { FieldDefinitionData } from './field-definition-data.interface';
import { FieldGroupData } from './field-group-data.interface';
import { TabData } from './tab-data.interface';

export interface TemplateData {
  readonly id: string;
  readonly name: string;
  readonly type: TemplateTypeEnum;
  readonly isDefault: boolean;
  readonly updatedAt: Date;
  readonly createdAt: Date;
}

export interface TabWithFieldGroupsData extends TabData {
  fieldGroups: FieldGroupData[];
}

export interface FieldGroupsWithDefinitionsData extends FieldGroupData {
  fieldDefinitions: FieldDefinitionData[];
}

export interface TemplateWithRelationsData extends TemplateData {
  tabs: TabWithFieldGroupsData[];
  fieldGroups: FieldGroupsWithDefinitionsData[];
}
