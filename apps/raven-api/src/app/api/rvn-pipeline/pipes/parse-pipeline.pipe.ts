import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { PipelineDefinitionEntity } from '../entities/pipeline-definition.entity';

export class ParsePipelinePipe extends AbstractEntityPipe<PipelineDefinitionEntity> {
  public readonly entityClass = PipelineDefinitionEntity;
  public readonly resource = 'pipeline';
}
