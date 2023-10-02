import { UserEntity } from '../../api/rvn-users/entities/user.entity';

export interface AuditableEntity {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdBy: UserEntity;
  readonly createdById: string;
}
