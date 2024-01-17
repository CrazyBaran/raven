import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { PipelineGroupEntity } from '../entities/pipeline-group.entity';

export class ParsePipelineGroupWithStagesPipe extends AbstractEntityPipe<PipelineGroupEntity> {
  public readonly entityClass = PipelineGroupEntity;
  public readonly resource = 'pipelineGroup';
  public readonly relations = ['stages'];
}
