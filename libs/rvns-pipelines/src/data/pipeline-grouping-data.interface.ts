export interface PipelineGroupData {
  readonly id: string;
  readonly name: string;
  readonly stages: { id: string; displayName: string }[];
}
export interface PipelineGroupingData {
  readonly pipelineId: string;
  readonly groups: PipelineGroupData[];
}
