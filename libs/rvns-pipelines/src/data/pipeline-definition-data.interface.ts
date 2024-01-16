import { PipelineGroupData } from './pipeline-grouping-data.interface';
import { PipelineStageData } from './pipeline-stage-data.interface';

export interface PipelineDefinitionData {
  readonly id: string;
  readonly name: string;
  readonly isDefault: boolean;
  readonly stages: PipelineStageData[];
  readonly groups?: PipelineGroupData[];
}
