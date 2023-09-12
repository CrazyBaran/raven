import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { UserEntity } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParseUserPipe extends AbstractEntityPipe<UserEntity> {
  public readonly entityClass = UserEntity;
  public readonly resource = 'user';
}
