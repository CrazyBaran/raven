import { Comparable } from '../interfaces/comparable';

export class PipelineStageStaticData
  implements Comparable<PipelineStageStaticData>
{
  public correspondingEntity: string = 'PipelineStageEntity';
  public constructor(
    public id: string,
    public displayName: string,
    public order: number,
    public mappedFrom: string,
    public configuration?: string,
    public pipelineDefinitionId?: string,
  ) {}

  public isSame(other: PipelineStageStaticData): boolean {
    return (
      this.id === other.id &&
      this.displayName === other.displayName &&
      this.order === other.order &&
      this.mappedFrom === other.mappedFrom &&
      this.pipelineDefinitionId === other.pipelineDefinitionId &&
      this.configuration === other.configuration
    );
  }

  public unsetNested(): void {}
}
