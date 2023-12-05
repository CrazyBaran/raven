import { OpportunityCreatedEvent } from '@app/rvns-opportunities';
import { Client } from '@microsoft/microsoft-graph-client';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EntityManager } from 'typeorm';
import { environment } from '../../../../environments/environment';
import { SharepointDirectoryStructureGenerator } from '../../../shared/sharepoint-directory-structure.generator';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';

@Injectable()
export class OpportunityCreatedEventHandler {
  public constructor(
    private readonly entityManager: EntityManager,
    private readonly graphClient: Client,
    private readonly logger: RavenLogger,
  ) {
    this.logger.setContext(OpportunityCreatedEventHandler.name);
  }

  @OnEvent('opportunity-created')
  protected async createSharepointDirectories(
    event: OpportunityCreatedEvent,
  ): Promise<void> {
    const opportunityEntity = await this.entityManager.findOne(
      OpportunityEntity,
      {
        where: { id: event.opportunityEntityId },
        relations: ['organisation', 'tag'],
      },
    );
    const ogranisationFolderId =
      await this.createSharepointDirectoryForOpportunityOrganisation(
        opportunityEntity,
      );
    const opportunityFolderId =
      await this.createSharepointDirectoryForOpportunity(
        opportunityEntity,
        ogranisationFolderId,
      );
    opportunityEntity.sharepointDirectoryId = opportunityFolderId;
    await this.entityManager.save(opportunityEntity);
  }

  private async createSharepointDirectoryForOpportunityOrganisation(
    opportunityEntity: OpportunityEntity,
  ): Promise<string> {
    const rootDirectoryId = environment.sharePoint.rootDirectoryId;
    const directory =
      SharepointDirectoryStructureGenerator.getDirectoryNameForOrganisation(
        opportunityEntity.organisation,
      );
    const existingFolderId = await this.getOrganisationDirectoryId(directory);
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

  private async getOrganisationDirectoryId(
    name: string,
  ): Promise<string | null> {
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
      this.logger.log(`Could not fetch directory information: ${e}`);
      throw e;
    }
  }
}