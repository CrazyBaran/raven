import { CompanyFilterOptions } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { OpportunityEntity } from '../../rvn-opportunities/entities/opportunity.entity';
import { OrganisationEntity } from '../../rvn-opportunities/entities/organisation.entity';
import {
  GetOrganisationsOptions,
  defaultGetOrganisationsOptions,
} from '../../rvn-opportunities/interfaces/get-organisations.options';
import { ShortlistsService } from '../../rvn-shortlists/shortlists.service';
import { TagEntity } from '../../rvn-tags/entities/tag.entity';
import { DataWarehouseOrderByMapper } from './order-by.mapper';

@Injectable()
export class OrganisationProvider {
  public constructor(
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    private readonly orderByMapper: DataWarehouseOrderByMapper,
    private readonly shortlistsService: ShortlistsService,
  ) {}
  public async getOrganisations(
    options: GetOrganisationsOptions,
    filterOptions?: CompanyFilterOptions,
  ): Promise<{ organisationIds: string[]; count: number }> {
    const queryBuilder =
      this.organisationRepository.createQueryBuilder('organisations');

    queryBuilder
      .leftJoinAndSelect('organisations.organisationDomains', 'domains')
      .leftJoinAndSelect('organisations.dataV1', 'data')
      .leftJoinAndSelect('organisations.opportunities', 'opportunities')
      .leftJoinAndSelect('opportunities.tag', 'tag')
      .leftJoinAndSelect('opportunities.pipelineStage', 'pipelineStage')
      .leftJoinAndSelect('opportunities.shares', 'shares')
      .leftJoinAndSelect('shares.actor', 'member')
      .leftJoinAndSelect('organisations.shortlists', 'shortlists');

    if (options?.shortlistId) {
      const mainShortlist =
        await this.shortlistsService.getMainShortlist(false);
      if (mainShortlist?.id === options.shortlistId) {
        queryBuilder.andWhere('shortlists.id IS NOT NULL');
      } else {
        queryBuilder.andWhere('shortlists.id = :shortlistId', {
          shortlistId: options.shortlistId,
        });
      }
    }

    //queryBuilder.select('organisation.id');

    const collate = 'COLLATE SQL_Latin1_General_CP1_CI_AS';
    if (options?.query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('data.name LIKE :query', {
            query: `%${options.query}%`,
          });

          qb.orWhere(`data.domain ${collate} LIKE :query ${collate}`, {
            query: `%${options.query}%`,
          });
        }),
      );
    }

    if (options.skip || options.take) {
      queryBuilder
        .skip(options.skip ?? defaultGetOrganisationsOptions.skip)
        .take(options.take ?? defaultGetOrganisationsOptions.take);
    }

    if (options.member) {
      queryBuilder.andWhere('member.id = :member', {
        member: options.member,
      });
    }

    let tagEntities = [];

    if (options.round) {
      const tagAssignedTo = await this.organisationRepository.manager
        .createQueryBuilder(TagEntity, 'tag')
        .select()
        .where('tag.id = :round', { round: options.round })
        .getOne();

      if (tagAssignedTo) tagEntities = [...tagEntities, tagAssignedTo];
    }

    if (tagEntities) {
      for (const tag of tagEntities) {
        const tagSubQuery = this.organisationRepository.manager
          .createQueryBuilder(OpportunityEntity, 'opportunity_with_tag')
          .select('opportunity_with_tag.organisationId')
          .innerJoin('opportunity_with_tag.tag', 'subquerytag')
          .where('subquerytag.id = :tagId');

        queryBuilder
          .andWhere(`organisations.id IN (${tagSubQuery.getQuery()})`)
          .setParameter('tagId', tag.id);
      }
    }

    if (options.orderBy) {
      const orderBy = `${this.orderByMapper.map(options?.orderBy)}`;
      const direction =
        options?.direction ?? defaultGetOrganisationsOptions.direction;
      queryBuilder.orderBy(orderBy, direction);
    }

    if (options.filters?.status) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (options.filters.status.includes(null)) {
            qb.orWhere(
              new Brackets((qb) => {
                qb.where(
                  'organisations.companyStatusOverride IS NULL',
                ).andWhere('pipelineStage.relatedCompanyStatus IS NULL');
              }),
            );
          }
          const statuses = options.filters.status.filter(
            (status) => status != null,
          );
          if (statuses && statuses.length > 0) {
            qb.andWhere(
              'organisations.companyStatusOverride IN (:...statuses)',
              {
                statuses: statuses,
              },
            ).orWhere(
              new Brackets((qb) => {
                qb.where(
                  'pipelineStage.relatedCompanyStatus IN (:...statuses)',
                  {
                    statuses: statuses,
                  },
                ).andWhere('organisations.companyStatusOverride is null');
              }),
            );
          }
        }),
      );
    }

    if (filterOptions?.industries && filterOptions.industries.length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('data.specterIndustry IN (:...industries)', {
            industries: filterOptions.industries,
          });

          qb.orWhere('data.specterSubIndustry IN (:...industries)', {
            industries: filterOptions.industries,
          });
        }),
      );
    }

    if (filterOptions?.investors && filterOptions.investors.length > 0) {
      queryBuilder.andWhere('data.specterInvestors IN (:...investors)', {
        investors: filterOptions.investors,
      });
    }

    if (filterOptions?.totalFundingAmount) {
      if (filterOptions.totalFundingAmount.min) {
        queryBuilder.andWhere('data.fundingTotalFundingAmount >= :min', {
          min: filterOptions.totalFundingAmount.min,
        });
      }

      if (filterOptions.totalFundingAmount.max) {
        queryBuilder.andWhere('data.fundingTotalFundingAmount <= :max', {
          max: filterOptions.totalFundingAmount.max,
        });
      }
    }

    if (filterOptions?.lastFundingAmount) {
      if (filterOptions.lastFundingAmount.min) {
        queryBuilder.andWhere('data.fundingLastFundingAmount >= :min', {
          min: filterOptions.lastFundingAmount.min,
        });
      }

      if (filterOptions.lastFundingAmount.max) {
        queryBuilder.andWhere('data.fundingLastFundingAmount <= :max', {
          max: filterOptions.lastFundingAmount.max,
        });
      }
    }

    if (filterOptions?.lastFundingDate) {
      if (filterOptions.lastFundingDate.min) {
        queryBuilder.andWhere('data.fundingLastFundingDate >= :min', {
          min: filterOptions.lastFundingDate.min.toISOString(),
        });
      }

      if (filterOptions.lastFundingDate.max) {
        queryBuilder.andWhere('data.fundingLastFundingDate <= :max', {
          max: filterOptions.lastFundingDate.max.toISOString(),
        });
      }
    }

    if (filterOptions?.lastFundingType) {
      queryBuilder.andWhere('data.fundingLastFundingType in (:...type)', {
        type: filterOptions.lastFundingType,
      });
    }

    if (filterOptions?.lastFundingRound) {
      queryBuilder.andWhere('data.fundingLastFundingRound in (:...round)', {
        round: filterOptions.lastFundingRound,
      });
    }

    if (filterOptions?.countries) {
      queryBuilder.andWhere('data.hqCountry IN (:...countries)', {
        countries: filterOptions.countries,
      });
    }

    if (filterOptions?.mcvLeadScore) {
      if (filterOptions.mcvLeadScore.min) {
        queryBuilder.andWhere('data.mcvLeadScore >= :min', {
          min: filterOptions.mcvLeadScore.min,
        });
      }

      if (filterOptions.mcvLeadScore.max) {
        queryBuilder.andWhere('data.mcvLeadScore <= :max', {
          max: filterOptions.mcvLeadScore.max,
        });
      }
    }

    const [result, count] = await queryBuilder.getManyAndCount();
    return { organisationIds: result.map((org) => org.id), count };
  }
}
