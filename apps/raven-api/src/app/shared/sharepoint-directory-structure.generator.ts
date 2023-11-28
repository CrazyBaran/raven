import { environment } from '../../environments/environment';
import { OpportunityEntity } from '../api/rvn-opportunities/entities/opportunity.entity';

export class SharepointDirectoryStructureGenerator {
  public static getDirectoryForOpportunity(
    opportunityEntity: OpportunityEntity,
  ): string {
    const organisationDirectory =
      SharepointDirectoryStructureGenerator.getDirectoryForOpportunityOrganisation(
        opportunityEntity,
      );
    return `${organisationDirectory}/${opportunityEntity.tag.name}`;
  }

  public static getDirectoryForOpportunityOrganisation(
    opportunityEntity: OpportunityEntity,
  ): string {
    const root = environment.sharePoint.rootDirectory;
    const organisation = opportunityEntity.organisation;
    return `${root}/${organisation.name}(${organisation.domains[0]})`;
  }
}
