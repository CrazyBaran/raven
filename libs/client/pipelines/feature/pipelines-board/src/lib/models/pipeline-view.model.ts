import { PipelineStageData } from '../../../../../../../rvns-pipelines/src';

export interface PipelineViewConfigColumn {
  color?: string;
  backgroundColor?: string;
  name: string;
  flat?: boolean;
  stages: Partial<PipelineStageData>[];
}

export interface PipelineViewConfig {
  id: string;
  name: string;
  columns: PipelineViewConfigColumn[];
}
