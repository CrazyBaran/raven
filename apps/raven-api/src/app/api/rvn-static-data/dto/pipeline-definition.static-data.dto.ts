import * as _ from 'lodash';
import { Comparable } from '../interfaces/comparable';
import { PipelineStageStaticData } from './pipeline-stage.static-data.dto';

export class PipelineDefinitionStaticData
  implements Comparable<PipelineDefinitionStaticData>
{
  public correspondingEntity: string = 'PipelineDefinitionEntity';
  public constructor(
    public id: string,
    public name: string,
    public isDefault: boolean,
    public affinityListId: number,
    public affinityStatusFieldId: number,
    public pipelineStages: PipelineStageStaticData[],
  ) {}

  public isSame(other: PipelineDefinitionStaticData): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.isDefault === other.isDefault &&
      this.affinityListId === other.affinityListId &&
      this.affinityStatusFieldId === other.affinityStatusFieldId
    );
  }

  public unsetNested(): void {
    _.unset(this, 'pipelineStages');
  }
}
