interface RelatedFieldDefinitionData {
  readonly id: string;
  readonly name: string;
}

interface PipelineStageData {
  readonly id: string;
  readonly displayName: string;
}

export interface TabData {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly templateId: string;
  readonly pipelineStages: PipelineStageData[];
  readonly relatedFields: RelatedFieldDefinitionData[];
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly createdById: string;
}
