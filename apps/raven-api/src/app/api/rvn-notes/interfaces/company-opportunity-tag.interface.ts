import {
  OrganisationTagEntity,
  TagEntity,
} from '../../rvn-tags/entities/tag.entity';

export interface CompanyOpportunityTag {
  companyTag: OrganisationTagEntity;
  opportunityTag: TagEntity;
}
