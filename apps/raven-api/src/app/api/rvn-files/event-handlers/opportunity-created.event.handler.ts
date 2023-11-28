import { OpportunityCreatedEvent } from '@app/rvns-opportunities';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EntityManager } from 'typeorm';
import { SharepointDirectoryStructureGenerator } from '../../../shared/sharepoint-directory-structure.generator';
import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';
import { SharePointService } from '../share-point.service';

@Injectable()
export class OpportunityCreatedEventHandler {
  public constructor(
    private readonly entityManager: EntityManager,
    private readonly sharePointService: SharePointService,
  ) {}

  @OnEvent('opportunity-created')
  protected async createSharepointDirectory(
    event: OpportunityCreatedEvent,
  ): Promise<void> {
    const opportunityEntity = await this.entityManager.findOne(
      OpportunityEntity,
      {
        where: { id: event.opportunityEntityId },
        relations: ['organisation', 'tag'],
      },
    );
    await this.createSharepointDirectoryForOpportunityOrganisation(
      opportunityEntity,
    );
    await this.createSharepointDirectoryForOpportunity(opportunityEntity);
  }

  private async createSharepointDirectoryForOpportunity(
    opportunityEntity: OpportunityEntity,
  ): Promise<void> {
    const directory =
      SharepointDirectoryStructureGenerator.getDirectoryForOpportunity(
        opportunityEntity,
      );
    await this.sharePointService.createDirectory(directory);
  }

  private async createSharepointDirectoryForOpportunityOrganisation(
    opportunityEntity: OpportunityEntity,
  ): Promise<void> {
    const directory =
      SharepointDirectoryStructureGenerator.getDirectoryForOpportunityOrganisation(
        opportunityEntity,
      );
    await this.sharePointService.createDirectory(directory);
  }
}
