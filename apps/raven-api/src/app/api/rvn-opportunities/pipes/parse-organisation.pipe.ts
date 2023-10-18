import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { OrganisationEntity } from '../entities/organisation.entity';

export class ParseOrganisationPipe extends AbstractEntityPipe<OrganisationEntity> {
  public readonly entityClass = OrganisationEntity;
  public readonly resource = 'organisation';
}
