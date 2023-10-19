import { EntityTarget } from 'typeorm/common/EntityTarget';
import { AbstractShareEntity } from '../entities/abstract-share.entity';
import { ShareResourceCode } from '../enums/share-resource-code.enum';
import { ShareResource } from './share-resource.interface';

export interface ShareResourceId {
  readonly id: string;
  readonly code: ShareResourceCode;
  readonly shareEntityClass: EntityTarget<AbstractShareEntity>;
  readonly shareResourceEntityClass: EntityTarget<ShareResource>;
}
