import * as _ from 'lodash';
import { Comparable } from '../interfaces/comparable';
import { FieldDefinitionStaticData } from './field-definition.static-data.dto';

export class FieldGroupStaticData implements Comparable<FieldGroupStaticData> {
  public correspondingEntity: string = 'FieldGroupEntity';
  public constructor(
    public id: string,
    public name: string,
    public order: number,
    public tab_id: string,
    public fieldDefinitions: FieldDefinitionStaticData[],
    public templateId?: string,
  ) {}

  public isSame(other: FieldGroupStaticData): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.order === other.order &&
      this.tab_id === other.tab_id
    );
  }

  public unsetNested(): void {
    _.unset(this, 'fieldDefinitions');
  }
}
