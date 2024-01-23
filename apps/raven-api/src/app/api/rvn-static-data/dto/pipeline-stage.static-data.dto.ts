import { Comparable } from '../interfaces/comparable';
import { BaseArrayPropertiesStaticDataDto } from './base-array-properties.static-data.dto';

export class PipelineStageStaticData
  extends BaseArrayPropertiesStaticDataDto
  implements Comparable<PipelineStageStaticData>
{
  public correspondingEntity: string = 'PipelineStageEntity';
  public constructor(
    public id: string,
    public displayName: string,
    public order: number,
    public mappedFrom: string,
    public configuration?: string,
    public showFields?: string,
    public pipelineDefinitionId?: string,
  ) {
    super();
  }

  public isSame(other: PipelineStageStaticData): boolean {
    return (
      this.id === other.id &&
      this.displayName === other.displayName &&
      this.order === other.order &&
      this.mappedFrom === other.mappedFrom &&
      this.pipelineDefinitionId === other.pipelineDefinitionId &&
      this.configuration === other.configuration &&
      this.showFields === other.showFields
    );
  }

  public unsetNested(): void {}
}
