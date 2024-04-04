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
    /*
    https://support.microsoft.com/en-gb/office/restrictions-and-limitations-in-onedrive-and-sharepoint-64883a5d-228e-48f5-b3d2-eb39e07630fa#invalidcharacters
    Characters that aren't allowed in file and folder names in OneDrive for home or OneDrive for work or school
    " * : < > ? / \ |
      */
    return `${organisation.name}(${this.removeLeadingProtocol(
      organisation.domains[0],
    )})`
      .trim()
      .replace(/["#*:<>?/\\|]/g, '');
  }

  public static getDirectoryNameForOpportunity(
    opportunityEntity: OpportunityEntity,
  ): string {
    return `${opportunityEntity.tag?.name}`.replace(/["#*:<>?/\\|]/g, '');
  }

  private static removeLeadingProtocol(url: string): string {
    return url.replace(/^(http|https):\/\//, '');
  }
}
