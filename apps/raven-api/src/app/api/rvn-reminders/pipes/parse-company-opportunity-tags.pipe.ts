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

interface PipeOutput {
  companyTag?: OrganisationTagEntity;
  opportunityTag?: TagEntity;
}

@Injectable()
export class ParseCompanyOpportunityTagPipe
  implements
    PipeTransform<CompanyOpportunityTagInput, Promise<CompanyOpportunityTag>>
{
  @Inject(EntityManager)
  protected entityManager: EntityManager;

  public async transform(
    companyOpportunityTag: CompanyOpportunityTagInput | null,
  ): Promise<CompanyOpportunityTag> {
    if (!companyOpportunityTag || !companyOpportunityTag.companyId) {
      return null;
    }

    const companyTag = await this.entityManager.findOne(OrganisationTagEntity, {
      where: {
        id: companyOpportunityTag.companyId,
        type: TagTypeEnum.Company,
      },
    });

    const opportunityTag =
      companyOpportunityTag.opportunityId &&
      (await this.entityManager.findOne(TagEntity, {
        where: {
          id: companyOpportunityTag.opportunityId,
          type: In([TagTypeEnum.Opportunity, TagTypeEnum.Version]),
        },
      }));

    const output = {
      companyTag,
      opportunityTag,
    };
    this.validate(companyOpportunityTag, output);

    return output;
  }

  private validate(
    companyOpportunityTag: CompanyOpportunityTagInput,
    output: PipeOutput,
  ): void {
    const errors = [];
    if (!output?.companyTag) {
      errors.push(
        `Company tag with id ${companyOpportunityTag?.companyId} not found.`,
      );
    }
    if (companyOpportunityTag?.opportunityId && !output.opportunityTag) {
      errors.push(
        `Opportunity tag with id ${companyOpportunityTag?.opportunityId} not found.`,
      );
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join('\n'));
    }
  }
}
