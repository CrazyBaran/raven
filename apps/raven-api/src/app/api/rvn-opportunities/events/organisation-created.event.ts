import { OrganisationEntity } from '../entities/organisation.entity';

export class OrganisationCreatedEvent {
  public constructor(public readonly organisationEntity: OrganisationEntity) {}
}
