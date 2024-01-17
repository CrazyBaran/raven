export interface PipelineGroupData {
  readonly id: string;
  readonly name: string;
  readonly stages: { id: string; displayName: string }[];
}
export interface PipelineGroupingDataInterface {
  readonly pipelineId: string;
  readonly groups: PipelineGroupData[];
}
