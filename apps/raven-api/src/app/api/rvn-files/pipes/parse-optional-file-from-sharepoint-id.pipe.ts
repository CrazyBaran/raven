import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { FileEntity } from '../entities/file.entity';

export class ParseOptionalFileFromSharepointIdPipe extends AbstractEntityPipe<FileEntity> {
  public readonly entityClass = FileEntity;
  public readonly resource = 'file';
  public readonly optional = true;
  public readonly entityField = 'internalSharepointId';
}
