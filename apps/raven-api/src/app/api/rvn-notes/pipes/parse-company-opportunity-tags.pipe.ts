import { EntityManager, In } from 'typeorm';

import { TagTypeEnum } from '@app/rvns-tags';
import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  OrganisationTagEntity,
  TagEntity,
} from '../../rvn-tags/entities/tag.entity';
import { CompanyOpportunityTagInput } from '../interfaces/company-opportunity-tag-input.interface';
import { CompanyOpportunityTag } from '../interfaces/company-opportunity-tag.interface';

@Injectable()
export class ParseCompanyOpportunityTagsPipe
  implements
    PipeTransform<
      CompanyOpportunityTagInput[],
      Promise<CompanyOpportunityTag[]>
    >
{
  @Inject(EntityManager)
  protected entityManager: EntityManager;

  public async transform(
    complexTagIds: CompanyOpportunityTagInput[] | null,
  ): Promise<CompanyOpportunityTag[]> {
    if (!complexTagIds || complexTagIds.length === 0) {
      return [];
    }

    const distinctCompanyIds = [
      ...new Set(
        complexTagIds.map((complexTagId) => complexTagId.companyTagId),
      ),
    ];
    const distinctOpportunityIds = [
      ...new Set(
        complexTagIds.map((complexTagId) => complexTagId.opportunityTagId),
      ),
    ];

    const distinctVersionIds = [
      ...new Set(
        complexTagIds
          .map((complexTagId) => complexTagId.versionTagId)
          .filter((id) => !!id),
      ),
    ];

    const companyTags = await this.entityManager.find(OrganisationTagEntity, {
      where: {
        id: In(distinctCompanyIds),
        type: TagTypeEnum.Company,
      },
    });
    const opportunityTags = await this.entityManager.find(TagEntity, {
      where: {
        id: In(distinctOpportunityIds),
        type: TagTypeEnum.Opportunity,
      },
    });

    const versionTags = await this.entityManager.find(TagEntity, {
      where: {
        id: In(distinctVersionIds),
        type: TagTypeEnum.Version,
      },
    });

    this.validatePassedIds(
      distinctCompanyIds,
      distinctOpportunityIds,
      distinctVersionIds,
      companyTags,
      opportunityTags,
      versionTags,
    );

    return complexTagIds.map((complexTagId) => {
      const companyTag = companyTags.find(
        (companyTag) => companyTag.id === complexTagId.companyTagId,
      );
      const opportunityTag = opportunityTags.find(
        (opportunityTag) => opportunityTag.id === complexTagId.opportunityTagId,
      );
      const versionTag = complexTagId.versionTagId
        ? versionTags.find(
            (versionTag) => versionTag.id === complexTagId.versionTagId,
          )
        : undefined;

      return {
        companyTag,
        opportunityTag,
        versionTag,
      };
    });
  }

  private validatePassedIds(
    distinctCompanyIds: string[],
    distinctOpportunityIds: string[],
    distinctVersionIds: string[],
    companyTags: OrganisationTagEntity[],
    opportunityTags: TagEntity[],
    versionTags: TagEntity[],
  ): void {
    const errors = [];
    if (distinctCompanyIds.length !== companyTags.length) {
      const notFoundCompanies = distinctCompanyIds.filter(
        (id) => !companyTags.find((companyTag) => companyTag.id === id),
      );
      errors.push(
        `Company tags with ids ${notFoundCompanies.join(', ')} not found.`,
      );
    }
    if (distinctOpportunityIds.length !== opportunityTags.length) {
      const notFoundOpportunities = distinctOpportunityIds.filter(
        (id) =>
          !opportunityTags.find((opportunityTag) => opportunityTag.id === id),
      );
      errors.push(
        `Opportunity tags with ids ${notFoundOpportunities.join(
          ', ',
        )} not found.`,
      );
    }

    if (distinctVersionIds.length !== versionTags.length) {
      const notFoundVersions = distinctVersionIds.filter(
        (id) => !versionTags.find((versionTag) => versionTag.id === id),
      );
      errors.push(
        `Version tags with ids ${notFoundVersions.join(', ')} not found.`,
      );
    }
    if (errors.length > 0) {
      throw new BadRequestException(errors.join('\n'));
    }
  }
}
