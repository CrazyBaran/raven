interface RelatedSimpleEntityData {
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
  readonly relatedFields: RelatedSimpleEntityData[];
  readonly relatedTemplates: RelatedSimpleEntityData[];
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly createdById: string;
}
