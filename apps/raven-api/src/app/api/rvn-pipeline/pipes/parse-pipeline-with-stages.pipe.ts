import { ParsePipelinePipe } from './parse-pipeline.pipe';

export class ParsePipelineWithStagesPipe extends ParsePipelinePipe {
  public readonly relations = ['stages'];
}
