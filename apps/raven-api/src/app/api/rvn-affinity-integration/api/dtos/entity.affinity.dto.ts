import { AffinityOpportunityDto } from './opportunity.affinity.dto';
import { AffinityOrganizationDto } from './organization.affinity.dto';
import { AffinityPersonDto } from './person.affinity.dto';

export type AffinityEntityDto =
  | AffinityPersonDto
  | AffinityOrganizationDto
  | AffinityOpportunityDto;
