import { Comparable } from '../interfaces/comparable';
import { FieldDefinitionStaticData } from './field-definition.static-data.dto';
import { FieldGroupStaticData } from './field-group.static-data.dto';
import { PipelineDefinitionStaticData } from './pipeline-definition.static-data.dto';
import { PipelineStageStaticData } from './pipeline-stage.static-data.dto';
import { TabStaticData } from './tab.static-data.dto';
import { TemplateStaticData } from './template.static-data.dto';

export class BaseChange {
  public constructor(
    public changeType: ChangeType,
    public entityClass: string,
  ) {}
}

export class ModifiedChange<T extends Comparable<T>> extends BaseChange {
  public constructor(
    public entityClass: string,
    public oldData: T,
    public newData: T,
  ) {
    super(ChangeType.Modified, entityClass);
  }
}

export class AddedRemovedChange<T extends Comparable<T>> extends BaseChange {
  public constructor(
    changeType: ChangeType,
    entityClass: string,
    public data: Comparable<T>,
  ) {
    super(changeType, entityClass);
  }
}

export enum ChangeType {
  Added = 'Added',
  Removed = 'Removed',
  Modified = 'Modified',
}

type StaticData =
  | Comparable<PipelineDefinitionStaticData>
  | Comparable<PipelineStageStaticData>
  | Comparable<TemplateStaticData>
  | Comparable<FieldDefinitionStaticData>
  | Comparable<FieldGroupStaticData>
  | Comparable<TabStaticData>
  | PipelineDefinitionStaticData
  | PipelineStageStaticData
  | TemplateStaticData
  | FieldDefinitionStaticData
  | FieldGroupStaticData
  | TabStaticData;
