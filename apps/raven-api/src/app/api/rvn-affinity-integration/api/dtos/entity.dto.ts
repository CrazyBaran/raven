import { PersonDto } from './person.dto';
import { OrganizationDto } from './organization.dto';
import { OpportunityDto } from './opportunity.dto';

export type EntityDto = PersonDto | OrganizationDto | OpportunityDto;
