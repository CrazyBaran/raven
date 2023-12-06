import { environment } from '../../environments/environment';
import { OpportunityEntity } from '../api/rvn-opportunities/entities/opportunity.entity';
import { OrganisationEntity } from '../api/rvn-opportunities/entities/organisation.entity';
import { SharepointEnabledEntity } from './interfaces/sharepoint-enabled-entity.interface';

export class SharepointDirectoryStructureGenerator {
  public static getDirectoryForSharepointEnabledEntity(
    sharepointEnabledEntity: SharepointEnabledEntity,
  ): string {
    const { siteId } = environment.sharePoint;
    const itemId = sharepointEnabledEntity.sharepointDirectoryId;
    if (!itemId) {
      return '';
    }
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
