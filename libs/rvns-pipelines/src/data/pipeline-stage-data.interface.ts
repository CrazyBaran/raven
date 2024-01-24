export interface PipelineStageConfigurationData {
  readonly color: string;
  readonly order: number;
  readonly droppable: boolean;
  readonly droppableFrom: string[];
}

export interface PipelineStageData {
  readonly id: string;
  readonly displayName: string;
  readonly order: number;
  readonly mappedFrom: string;
  readonly configuration?: PipelineStageConfigurationData | null;
  readonly showFields?: { displayName: string; fieldName: string }[];
  readonly isHidden?: boolean;
}
