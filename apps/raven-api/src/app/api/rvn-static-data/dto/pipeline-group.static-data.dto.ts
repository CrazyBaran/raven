import { Comparable } from '../interfaces/comparable';
import { BaseArrayPropertiesStaticDataDto } from './base-array-properties.static-data.dto';

export class PipelineGroupStaticData
  extends BaseArrayPropertiesStaticDataDto
  implements Comparable<PipelineGroupStaticData>
{
  public correspondingEntity: string = 'PipelineGroupEntity';
  public constructor(
    public id: string,
    public groupName: string,
    public stageIds: string[],
  ) {
    super();
  }

  public isSame(other: PipelineGroupStaticData): boolean {
    return (
      this.id === other.id &&
      this.groupName === other.groupName &&
      this.compareArray(this.stageIds, other.stageIds)
    );
  }

  public unsetNested(): void {}
}
