import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { RoleEntity } from '../entities/role.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParseRoleByNamePipe extends AbstractEntityPipe<RoleEntity> {
  public readonly entityClass = RoleEntity;
  public readonly entityField = 'name';
  public readonly resource = 'role';
}
