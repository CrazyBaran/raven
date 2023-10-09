import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { PipelineStageEntity } from '../entities/pipeline-stage.entity';

export class ParsePipelineStagePipe extends AbstractEntityPipe<PipelineStageEntity> {
  public readonly entityClass = PipelineStageEntity;
  public readonly resource = 'pipeline-stage';
}
