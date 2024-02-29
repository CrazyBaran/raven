import { CompanyFilterOptions } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { RavenLogger } from '../../rvn-logger/raven.logger';
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
    private readonly logger: RavenLogger,
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    private readonly orderByMapper: DataWarehouseOrderByMapper,
    private readonly shortlistsService: ShortlistsService,
  ) {
    this.logger.setContext(OrganisationProvider.name);
  }
  public async getOrganisations(
    options: GetOrganisationsOptions,
    filterOptions?: CompanyFilterOptions,
  ): Promise<{ organisationIds: string[]; count: number }> {
    const queryBuilder =
      this.organisationRepository.createQueryBuilder('organisations');

    queryBuilder
      .leftJoinAndSelect('organisations.organisationDomains', 'domains')
      .leftJoinAndSelect('organisations.dataV1', 'data')
      .leftJoinAndSelect('data.industries', 'industries')
      .leftJoinAndSelect('data.investors', 'investors')
      .leftJoinAndSelect('organisations.opportunities', 'opportunities')
      .leftJoinAndSelect('opportunities.tag', 'tag')
      .leftJoinAndSelect('opportunities.pipelineStage', 'pipelineStage')
      .leftJoinAndSelect('opportunities.shares', 'shares')
      .leftJoinAndSelect('shares.actor', 'member')
      .leftJoinAndSelect('organisations.shortlists', 'shortlists');

    queryBuilder.where('organisations.name is not null');

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
          qb.where(`data.name ${collate} LIKE :dataNameSearch ${collate}`, {
            dataNameSearch: `%${options.query}%`,
          });

          qb.orWhere(
            `organisations.name ${collate} LIKE :organisationNameSearch ${collate}`,
            {
              organisationNameSearch: `%${options.query}%`,
            },
          );

          qb.orWhere(`domains.domain LIKE :domainSearch`, {
            domainSearch: `%${options.query}%`,
          });
        }),
      );
    }

    if (options?.skip || options?.take) {
      queryBuilder
        .skip(options?.skip ?? defaultGetOrganisationsOptions.skip)
        .take(options?.take ?? defaultGetOrganisationsOptions.take);
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

    if (options.filters?.status && options.filters.status.length > 0) {
      queryBuilder.leftJoin(
        (subQuery) => {
          return subQuery
            .select('organisation_id', 'orgId')
            .addSelect('MAX(created_at)', 'maxCreatedAt')
            .from('rvn_opportunities', 'op')
            .groupBy('op.organisation_id');
        },
        'latestOpportunity',
        'organisations.id = latestOpportunity.orgId',
      );

      queryBuilder.andWhere(
        new Brackets((qb) => {
          const statuses = options.filters.status.filter(
            (status) => status != null,
          );
          if (statuses && statuses.length > 0) {
            qb.where('organisations.companyStatusOverride IN (:...statuses)', {
              statuses: statuses,
            }).orWhere(
              new Brackets((qb2) => {
                qb2
                  .where(
                    'pipelineStage.relatedCompanyStatus IN (:...statuses)',
                    {
                      statuses: statuses,
                    },
                  )
                  .andWhere('organisations.companyStatusOverride is null');
              }),
            );
          }

          if (options.filters.status.includes(null)) {
            if (statuses.length > 1) {
              qb.orWhere(
                new Brackets((qb2) => {
                  qb2
                    .where('organisations.companyStatusOverride IS NULL')
                    .andWhere('pipelineStage.relatedCompanyStatus IS NULL')
                    .andWhere(
                      '(opportunities.createdAt IS NULL OR opportunities.createdAt = latestOpportunity.maxCreatedAt)',
                    );
                }),
              );
            } else {
              qb.where(
                new Brackets((qb2) => {
                  qb2
                    .where('organisations.companyStatusOverride IS NULL')
                    .andWhere('pipelineStage.relatedCompanyStatus IS NULL')
                    .andWhere(
                      '(opportunities.createdAt IS NULL OR opportunities.createdAt = latestOpportunity.maxCreatedAt)',
                    );
                }),
              );
            }
          }
        }),
      );
    }

    if (filterOptions?.industries && filterOptions.industries.length > 0) {
      queryBuilder.andWhere('industries.name IN (:...industries)', {
        industries: filterOptions.industries,
      });
    }

    if (filterOptions?.investors && filterOptions.investors.length > 0) {
      queryBuilder.andWhere('investors.name IN (:...investors)', {
        investors: filterOptions.investors,
      });
    }

    if (filterOptions?.totalFundingAmount) {
      if (filterOptions.totalFundingAmount.min) {
        queryBuilder.andWhere(
          'data.fundingTotalFundingAmount >= :minTotalFundingAmount',
          {
            minTotalFundingAmount: filterOptions.totalFundingAmount.min,
          },
        );
      }

      if (filterOptions.totalFundingAmount.max) {
        queryBuilder.andWhere(
          'data.fundingTotalFundingAmount <= :maxTotalFundingAmount',
          {
            maxTotalFundingAmount: filterOptions.totalFundingAmount.max,
          },
        );
      }
    }

    if (filterOptions?.lastFundingAmount) {
      if (filterOptions.lastFundingAmount.min) {
        queryBuilder.andWhere(
          'data.fundingLastFundingAmount >= :minLastFundingAmount',
          {
            minLastFundingAmount: filterOptions.lastFundingAmount.min,
          },
        );
      }

      if (filterOptions.lastFundingAmount.max) {
        queryBuilder.andWhere(
          'data.fundingLastFundingAmount <= :maxLastFundingAmount',
          {
            maxLastFundingAmount: filterOptions.lastFundingAmount.max,
          },
        );
      }
    }

    if (filterOptions?.lastFundingDate) {
      if (
        filterOptions.lastFundingDate.min &&
        !isNaN(filterOptions.lastFundingDate.min.getTime())
      ) {
        queryBuilder.andWhere('data.fundingLastFundingDate >= :minDate', {
          minDate: filterOptions.lastFundingDate.min.toISOString(),
        });
      }

      if (
        filterOptions.lastFundingDate.max &&
        !isNaN(filterOptions.lastFundingDate.max.getTime())
      ) {
        queryBuilder.andWhere('data.fundingLastFundingDate <= :maxDate', {
          maxDate: filterOptions.lastFundingDate.max.toISOString(),
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
