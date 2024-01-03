import { Comparable } from '../interfaces/comparable';
import { BaseArrayPropertiesStaticDataDto } from './base-array-properties.static-data.dto';

export class FieldDefinitionStaticData
  extends BaseArrayPropertiesStaticDataDto
  implements Comparable<FieldDefinitionStaticData>
{
  public correspondingEntity: string = 'FieldDefinitionEntity';
  public constructor(
    public id: string,
    public name: string,
    public type: string,
    public order: number,
    public configuration: string,
    public fieldGroupId?: string,
    public hideOnPipelineStageIds?: string[],
  ) {
    super();
  }

  public isSame(other: FieldDefinitionStaticData): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.type === other.type &&
      this.order === other.order &&
      this.configuration === other.configuration &&
      this.compareArray(
        this.hideOnPipelineStageIds,
        other.hideOnPipelineStageIds,
      )
    );
  }

  public unsetNested(): void {}
}
