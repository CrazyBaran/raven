import { UserEntity } from '../../api/rvn-users/entities/user.entity';

export interface AuditableEntity extends BaseAuditableEntity {
  readonly createdBy: UserEntity;
  readonly createdById: string;
}

export interface BaseAuditableEntity {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
