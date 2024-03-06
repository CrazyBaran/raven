import { UserEntity } from '../../rvn-users/entities/user.entity';
import { OrganisationEntity } from '../entities/organisation.entity';

export class OrganisationPassedEvent {
  public constructor(
    public readonly organisationEntity: OrganisationEntity,
    public readonly user: UserEntity,
  ) {}
}
