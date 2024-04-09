import { OpportunityCreatedEvent } from '@app/rvns-opportunities';
import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EntityManager } from 'typeorm';
import { environment } from '../../../../environments/environment';
import { SharepointDirectoryStructureGenerator } from '../../../shared/sharepoint-directory-structure.generator';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';
import { GatewayEventService } from '../../rvn-web-sockets/gateway/gateway-event.service';

@Injectable()
export class OpportunityCreatedEventHandler {
  public constructor(
    private readonly entityManager: EntityManager,
    private readonly graphClient: Client,
    private readonly logger: RavenLogger,
    private readonly gatewayEventService: GatewayEventService,
  ) {
    this.logger.setContext(OpportunityCreatedEventHandler.name);
  }

  @OnEvent('opportunity-note-created')
  protected async createSharepointDirectories(
    event: OpportunityCreatedEvent,
  ): Promise<void> {
    const opportunityEntity = await this.entityManager.findOne(
      OpportunityEntity,
      {
        where: { id: event.opportunityEntityId },
        relations: ['organisation', 'tag', 'organisation.organisationDomains'],
      },
    );
    const ogranisationFolderId =
      await this.createSharepointDirectoryForOpportunityOrganisation(
        opportunityEntity,
      );
    opportunityEntity.organisation.sharepointDirectoryId = ogranisationFolderId;

    const opportunityFolderId =
      await this.createSharepointDirectoryForOpportunity(
        opportunityEntity,
        ogranisationFolderId,
      );
    opportunityEntity.sharepointDirectoryId = opportunityFolderId;

    await this.entityManager.transaction(async (tem) => {
      delete opportunityEntity.organisation.organisationDomains; // we don't want to save this relation
      await tem.save(opportunityEntity.organisation);
      await tem.save(opportunityEntity);
    });

    const opportunityPath = `${SharepointDirectoryStructureGenerator.getDirectoryNameForOrganisation(
      opportunityEntity.organisation,
    )}/${SharepointDirectoryStructureGenerator.getDirectoryNameForOpportunity(
      opportunityEntity,
    )}`;
    const directories = environment.sharePoint.companyDirectories;
    for (const directory of directories) {
      const directoryPath = `${opportunityPath}/${directory}`;
      const existingFolderId = await this.getDirectoryIdForName(directoryPath);
      if (existingFolderId) {
        this.logger.log(
          `Directory '${directory}' already exists in opportunity ${opportunityEntity.id} folder`,
        );
        continue;
      }
      await this.createDirectory(directory, opportunityFolderId);
    }

    this.gatewayEventService.emit(`resource-opportunities`, {
      eventType: 'opportunity-note-created-progress-finished',
      data: { id: event.opportunityEntityId },
    });
  }

  private async createSharepointDirectoryForOpportunityOrganisation(
    opportunityEntity: OpportunityEntity,
  ): Promise<string> {
    const rootDirectoryId = environment.sharePoint.rootDirectoryId;
    const directory =
      SharepointDirectoryStructureGenerator.getDirectoryNameForOrganisation(
        opportunityEntity.organisation,
      );
    const existingFolderId = await this.getDirectoryIdForName(directory);
    if (existingFolderId) {
      return existingFolderId;
    }
    return await this.createDirectory(directory, rootDirectoryId);
  }

  private async createSharepointDirectoryForOpportunity(
    opportunityEntity: OpportunityEntity,
    organisationFolderId: string,
  ): Promise<string> {
    const directory =
      SharepointDirectoryStructureGenerator.getDirectoryNameForOpportunity(
        opportunityEntity,
      );
    const organisationDirectory =
      SharepointDirectoryStructureGenerator.getDirectoryNameForOrganisation(
        opportunityEntity.organisation,
      );
    const organisationOpportunityPath = `${organisationDirectory}/${directory}`;
    const existingFolderId = await this.getDirectoryIdForName(
      organisationOpportunityPath,
    );
    if (existingFolderId) {
      this.logger.log(
        `Directory ${organisationOpportunityPath} already exists`,
      );
      return existingFolderId;
    }
    return await this.createDirectory(directory, organisationFolderId);
  }

  private async createDirectory(
    name: string,
    parentFolderId: string,
  ): Promise<string> {
    const driveItem = {
      name,
      folder: {},
      '@microsoft.graph.conflictBehavior': 'fail',
    };
    const { siteId, driveId } = environment.sharePoint;
    try {
      const response = await this.graphClient
        .api(
          `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${parentFolderId}/children`,
        )
        .post(driveItem);

      return response.id;
    } catch (e) {
      this.logger.log(`Could not create directory: ${e}`);
      throw e;
    }
  }

  private async getDirectoryIdForName(name: string): Promise<string | null> {
    const { siteId, driveId, rootDirectory } = environment.sharePoint;
    try {
      const response = await this.graphClient
        .api(
          `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${rootDirectory}/${name}`,
        )
        .get();
      return response.id;
    } catch (e) {
      if (e.statusCode === 404) {
        return null;
      }
      this.logger.log(
        `Could not fetch directory information for name: ${name}: ${e}`,
      );
      throw e;
    }
  }
}
