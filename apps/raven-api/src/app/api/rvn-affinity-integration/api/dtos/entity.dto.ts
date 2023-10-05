import { OpportunityDto } from './opportunity.dto';
import { OrganizationDto } from './organization.dto';
import { PersonDto } from './person.dto';

export type EntityDto = PersonDto | OrganizationDto | OpportunityDto;
