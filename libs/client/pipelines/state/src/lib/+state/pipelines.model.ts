import { PipelineDefinitionData, PipelineStageData } from '@app/rvns-pipelines';

export type PipelineDefinition = Omit<PipelineDefinitionData, 'stages'> & {
  readonly stages: (PipelineStageData & {
    primaryColor: string;
    secondaryColor: string;
  })[];
};
