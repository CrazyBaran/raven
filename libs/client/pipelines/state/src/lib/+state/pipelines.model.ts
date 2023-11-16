import { PipelineDefinition } from '@app/client/pipelines/data-access';

export type PipelineDefinitionModel = Omit<PipelineDefinition, 'stages'> & {
  stages: (PipelineDefinition['stages'][number] & {
    primaryColor: string;
    secondaryColor: string;
  })[];
};
