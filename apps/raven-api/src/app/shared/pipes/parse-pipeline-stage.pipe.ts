import { PipelineStageEntity } from '../../api/rvn-pipeline/entities/pipeline-stage.entity';
import { AbstractEntityPipe } from './abstract-entity.pipe';

export class ParsePipelineStagePipe extends AbstractEntityPipe<PipelineStageEntity> {
  public readonly entityClass = PipelineStageEntity;
  public readonly resource = 'pipeline-stage';
}
