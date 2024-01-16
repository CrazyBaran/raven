interface PipelineGroupData {
  readonly id: string;
  readonly name: string;
  readonly stageIds: string[];
}
export interface PipelineGroupingDataInterface {
  readonly pipelineId: string;
  readonly groups: PipelineGroupData[];
}
