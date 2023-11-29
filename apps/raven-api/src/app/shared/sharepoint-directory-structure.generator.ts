import { environment } from '../../environments/environment';
import { OpportunityEntity } from '../api/rvn-opportunities/entities/opportunity.entity';
import { OrganisationEntity } from '../api/rvn-opportunities/entities/organisation.entity';

export class SharepointDirectoryStructureGenerator {
  public static getDirectoryForOpportunity(
    opportunityEntity: OpportunityEntity,
  ): string {
    const organisationDirectory =
      this.getDirectoryForOpportunityOrganisation(opportunityEntity);
    return `${organisationDirectory}/${this.getDirectoryNameForOpportunity(
      opportunityEntity,
    )}`;
  }

  public static getDirectoryForOpportunityOrganisation(
    opportunityEntity: OpportunityEntity,
  ): string {
    const root = environment.sharePoint.rootDirectory;
    const organisation = opportunityEntity.organisation;
    return `${root}/${this.getDirectoryNameForOrganisation(organisation)}`;
  }

  public static getDirectoryNameForOrganisation(
    organisation: OrganisationEntity,
  ): string {
    return `${organisation.name}(${this.removeLeadingProtocol(
      organisation.domains[0],
    )})`;
  }

  public static getDirectoryNameForOpportunity(
    opportunityEntity: OpportunityEntity,
  ): string {
    return `${opportunityEntity.tag.name}`;
  }

  private static removeLeadingProtocol(url: string): string {
    return url.replace(/^(http|https):\/\//, '');
  }
}
