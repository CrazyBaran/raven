import * as _ from 'lodash';
import { Comparable } from '../interfaces/comparable';
import { FieldGroupStaticData } from './field-group.static-data.dto';
import { TabStaticData } from './tab.static-data.dto';

export class TemplateStaticData implements Comparable<TemplateStaticData> {
  public correspondingEntity: string = 'TemplateEntity';
  public constructor(
    public id: string,
    public name: string,
    public type: string,
    public isDefault: boolean,
    public fieldGroups: FieldGroupStaticData[],
    public tabs?: TabStaticData[],
  ) {}

  public isSame(other: TemplateStaticData): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.type === other.type &&
      this.isDefault === other.isDefault
    );
  }

  public unsetNested(): void {
    _.unset(this, 'fieldGroups');
    _.unset(this, 'tabs');
  }
}
