import { environment } from '../../environments/environment';
import { OpportunityEntity } from '../api/rvn-opportunities/entities/opportunity.entity';
import { OrganisationEntity } from '../api/rvn-opportunities/entities/organisation.entity';

export class SharepointDirectoryStructureGenerator {
  public static getDirectoryForOpportunity(
    opportunityEntity: OpportunityEntity,
  ): string {
    const { siteId } = environment.sharePoint;
    const itemId = opportunityEntity.sharepointDirectoryId;
    return `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${itemId}/children`;
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
    return `${opportunityEntity.tag?.name}`;
  }

  private static removeLeadingProtocol(url: string): string {
    return url.replace(/^(http|https):\/\//, '');
  }
}
