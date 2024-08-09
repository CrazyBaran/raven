export interface PipelineViewData {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly columns: { id: string; name: string; stageIds: string[] }[];
  readonly isDefault: boolean;
  readonly icon: string;
}
export interface PipelineViewsData {
  readonly pipelineId: string;
  readonly views: PipelineViewData[];
}
