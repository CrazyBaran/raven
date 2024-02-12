import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { PipelineUtilityService } from '../rvn-pipeline/pipeline-utility.service';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';

Injectable();
export class OpportunityChecker {
  public constructor(
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    private readonly pipelineUtilityService: PipelineUtilityService,
  ) {}

  public async hasActivePipelineItem(
    organisation: OrganisationEntity,
  ): Promise<boolean> {
    return await this.hasActivePipelineItemOtherThan(organisation, null);
  }

  public async hasActivePipelineItemOtherThan(
    organisation: OrganisationEntity,
    processedOpportunity: OpportunityEntity,
  ): Promise<boolean> {
    const organisationWithOpportunities =
      await this.organisationRepository.findOne({
        where: {
          id: organisation.id,
        },
        relations: [
          'opportunities',
          'organisationDomains',
          'opportunities.pipelineStage',
        ],
      });

    if (!organisationWithOpportunities) {
      throw new Error(`Organisation with id ${organisation.id} not found`);
    }

    if (
      !organisationWithOpportunities.opportunities ||
      organisationWithOpportunities.opportunities.length === 0
    ) {
      return false;
    }

    return organisationWithOpportunities.opportunities
      .filter((opportunity) => opportunity.id !== processedOpportunity?.id)
      .some(
        async (opportunity) =>
          await this.pipelineUtilityService.isActivePipelineItemStage(
            opportunity.pipelineStage,
          ),
      );
  }

  public async getActiveOrNewestOpportunity(
    organisation: OrganisationEntity,
  ): Promise<OpportunityEntity | null> {
    if (organisation.opportunities.length === 0) return null;

    const activeOpportunity = organisation.opportunities.find(
      async (opportunity) =>
        await this.pipelineUtilityService.isActivePipelineItemStage(
          opportunity.pipelineStage,
        ),
    );

    if (activeOpportunity) return activeOpportunity;

    return organisation.opportunities
      .map((opportunity) => opportunity)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }

  public async ensureNoConflictingOpportunity(
    organisation: OrganisationEntity,
    opportunity?: OpportunityEntity,
    pipelineStage?: PipelineStageEntity,
  ): Promise<void> {
    if (pipelineStage) {
      if (
        !(await this.pipelineUtilityService.isActivePipelineItemStage(
          pipelineStage,
        ))
      ) {
        return;
      }
    }

    const hasConflict = await this.hasActivePipelineItemOtherThan(
      organisation,
      opportunity,
    );

    if (hasConflict) {
      throw new ConflictException(
        `Organisation with id ${organisation.id} already has active pipeline item`,
      );
    }
  }
}
