import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { PipelineStageEntity } from '../../rvn-pipeline/entities/pipeline-stage.entity';

export class ParseOptionalPipelineStagePipe extends AbstractEntityPipe<PipelineStageEntity> {
  public readonly entityClass = PipelineStageEntity;
  public readonly resource = 'pipeline-stage';
  public readonly optional = true;
}
