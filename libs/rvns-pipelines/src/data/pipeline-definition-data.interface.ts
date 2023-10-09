import { PipelineStageData } from './pipeline-stage-data.interface';

export interface PipelineDefinitionData {
  readonly id: string;
  readonly name: string;
  readonly isDefault: boolean;
  readonly stages: PipelineStageData[];
}
