import { Comparable } from '../interfaces/comparable';
import { BaseArrayPropertiesStaticDataDto } from './base-array-properties.static-data.dto';

export class TabStaticData
  extends BaseArrayPropertiesStaticDataDto
  implements Comparable<TabStaticData>
{
  public correspondingEntity: string = 'TabEntity';
  public constructor(
    public id: string,
    public name: string,
    public order: number,
    public pipelineStageIds: string[],
    public relatedFieldIds: string[],
    public relatedTemplateIds: string[],
    public templateId?: string,
  ) {
    super();
  }

  public isSame(other: TabStaticData): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.order === other.order &&
      this.compareArray(this.pipelineStageIds, other.pipelineStageIds) &&
      this.compareArray(this.relatedFieldIds, other.relatedFieldIds) &&
      this.compareArray(this.relatedTemplateIds, other.relatedTemplateIds)
    );
  }

  public unsetNested(): void {}
}
