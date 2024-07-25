import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { PipelineViewEntity } from '../entities/pipeline-view.entity';

export class ParsePipelineView extends AbstractEntityPipe<PipelineViewEntity> {
  public readonly entityClass = PipelineViewEntity;
  public readonly resource = 'view';
}
