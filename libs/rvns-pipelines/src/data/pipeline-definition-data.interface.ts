import { PipelineStageData } from './pipeline-stage-data.interface';

export interface PipelineDefinitionData {
  readonly id: string;
  readonly stages: PipelineStageData[];
}
