import {
  CompanyDto,
  CompanyFilterOptions,
  DataWarehouseAccess,
  DataWarehouseCompanyOrderBy,
  DataWarehouseFounderOrderBy,
  FounderDto,
  GetCompaniesOptions,
  GroupedEntity,
} from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import {
  And,
  Brackets,
  FindManyOptions,
  In,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { defaultGetOrganisationsOptions } from '../../rvn-opportunities/interfaces/get-organisations.options';
import { DWH_COMPANY_SELECT_COLUMNS } from '../data-warehouse.const';
import { InjectDataWarehouseRepository } from '../utils/inject-data-warehouse-repository.decorator';
import { CompanyDwhEntity } from './entities/company.dwh.entity';
import { DealroomCompanyNumberOfEmployeesDwhEntity } from './entities/dealroom-company-number-of-employees.dwh.entity';
import { DealroomCompanyTagEntity } from './entities/dealroom-company-tags.dwh.entity';
import { DealroomFundingRoundEntity } from './entities/dealroom-funding-rounds.dwh.entity';
import { FounderDwhEntity } from './entities/founder.dwh.entity';
import { InvestorDwhEntity } from './entities/investor.dwh.entity';
import { CompanyMapper } from './mappers/company.mapper';
import { FounderMapper } from './mappers/founder.mapper';
import { DataWarehouseOrderByMapper } from './mappers/order-by.mapper';

@Injectable()
export class DataWarehouseAccessService implements DataWarehouseAccess {
  public constructor(
    private readonly logger: RavenLogger,
    @InjectDataWarehouseRepository(CompanyDwhEntity)
    private readonly companyRepository: Repository<CompanyDwhEntity>,
    @InjectDataWarehouseRepository(DealroomCompanyNumberOfEmployeesDwhEntity)
    private readonly dealroomCompanyNumberOfEmployeesRepository: Repository<DealroomCompanyNumberOfEmployeesDwhEntity>,
    @InjectDataWarehouseRepository(DealroomCompanyTagEntity)
    private readonly dealroomCompanyTagRepository: Repository<DealroomCompanyTagEntity>,
    @InjectDataWarehouseRepository(DealroomFundingRoundEntity)
    private readonly dealroomFundingRoundRepository: Repository<DealroomFundingRoundEntity>,
    @InjectDataWarehouseRepository(FounderDwhEntity)
    private readonly founderRepository: Repository<FounderDwhEntity>,
    @InjectDataWarehouseRepository(InvestorDwhEntity)
    private readonly investorRepository: Repository<InvestorDwhEntity>,
    private readonly companyMapper: CompanyMapper,
    private readonly founderMapper: FounderMapper,
    private readonly orderByMapper: DataWarehouseOrderByMapper,
  ) {
    this.logger.setContext(DataWarehouseAccessService.name);
  }

  public async getLastUpdated(): Promise<{
    lastUpdated: Date;
    specter: Date;
    dealRoom: Date;
  }> {
    const lastUpdatedDealRoom = await this.companyRepository.findOne({
      order: {
        dealRoomLastUpdated: 'DESC',
      },
      where: {
        dealRoomLastUpdated: Not(IsNull()),
      },
    });

    const lastUpdatedSpecter = await this.companyRepository.findOne({
      order: {
        specterLastUpdated: 'DESC',
      },
      where: {
        specterLastUpdated: Not(IsNull()),
      },
    });

    return {
      lastUpdated: new Date(
        Math.max(
          lastUpdatedDealRoom.dealRoomLastUpdated.getTime(),
          lastUpdatedSpecter.specterLastUpdated.getTime(),
        ),
      ),
      specter: lastUpdatedSpecter.specterLastUpdated,
      dealRoom: lastUpdatedDealRoom.dealRoomLastUpdated,
    };
  }

  public async filterCompanies(
    options?: GetCompaniesOptions,
    filterOptions?: CompanyFilterOptions,
  ): Promise<{ items: Partial<CompanyDto>[]; count: number }> {
    const queryBuilder = this.companyRepository.createQueryBuilder('company');

    queryBuilder.select('company.domain');

    queryBuilder.where('company.domain IS NOT NULL');

    if (options?.take || options?.skip) {
      queryBuilder
        .take(options?.take ?? defaultGetOrganisationsOptions.take)
        .skip(options?.skip ?? defaultGetOrganisationsOptions.skip);
    } else {
      queryBuilder.skip(0).take(defaultGetOrganisationsOptions.take);
    }

    if (options?.orderBy) {
      const orderBy = `company.${this.orderByMapper.map(options?.orderBy)}`;
      const direction =
        options?.direction ?? defaultGetOrganisationsOptions.direction;
      queryBuilder.orderBy(orderBy, direction);
    }

    const collate = 'COLLATE SQL_Latin1_General_CP1_CI_AS';
    if (options?.query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('company.name LIKE :query', {
            query: `%${options.query}%`,
          });

          qb.orWhere(`company.domain ${collate} LIKE :query ${collate}`, {
            query: `%${options.query}%`,
          });
        }),
      );
    }

    if (filterOptions?.industries && filterOptions.industries.length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('company.specterIndustry IN (:...industries)', {
            industries: filterOptions.industries,
          });

          qb.orWhere('company.specterSubIndustry IN (:...industries)', {
            industries: filterOptions.industries,
          });
        }),
      );
    }

    if (filterOptions?.investors && filterOptions.investors.length > 0) {
      queryBuilder.andWhere('company.specterInvestors IN (:...investors)', {
        investors: filterOptions.investors,
      });
    }

    if (filterOptions?.totalFundingAmount) {
      if (filterOptions.totalFundingAmount.min) {
        queryBuilder.andWhere('company.totalFundingAmount >= :min', {
          min: filterOptions.totalFundingAmount.min,
        });
      }

      if (filterOptions.totalFundingAmount.max) {
        queryBuilder.andWhere('company.totalFundingAmount <= :max', {
          max: filterOptions.totalFundingAmount.max,
        });
      }
    }

    if (filterOptions?.lastFundingAmount) {
      if (filterOptions.lastFundingAmount.min) {
        queryBuilder.andWhere('company.lastFundingAmount >= :min', {
          min: filterOptions.lastFundingAmount.min,
        });
      }

      if (filterOptions.lastFundingAmount.max) {
        queryBuilder.andWhere('company.lastFundingAmount <= :max', {
          max: filterOptions.lastFundingAmount.max,
        });
      }
    }

    if (filterOptions?.lastFundingDate) {
      if (filterOptions.lastFundingDate.min) {
        queryBuilder.andWhere('company.lastFundingDate >= :min', {
          min: filterOptions.lastFundingDate.min.toISOString(),
        });
      }

      if (filterOptions.lastFundingDate.max) {
        queryBuilder.andWhere('company.lastFundingDate <= :max', {
          max: filterOptions.lastFundingDate.max.toISOString(),
        });
      }
    }

    if (filterOptions?.lastFundingType) {
      queryBuilder.andWhere('company.specterLastFundingType in (:...type)', {
        type: filterOptions.lastFundingType,
      });
    }

    if (filterOptions?.lastFundingRound) {
      queryBuilder.andWhere('company.dealRoomLastFundingRound in (:...round)', {
        round: filterOptions.lastFundingRound,
      });
    }

    if (filterOptions?.countries) {
      queryBuilder.andWhere('company.country IN (:...countries)', {
        countries: filterOptions.countries,
      });
    }

    if (filterOptions?.mcvLeadScore) {
      if (filterOptions.mcvLeadScore.min) {
        queryBuilder.andWhere('company.mcvLeadScore >= :min', {
          min: filterOptions.mcvLeadScore.min,
        });
      }

      if (filterOptions.mcvLeadScore.max) {
        queryBuilder.andWhere('company.mcvLeadScore <= :max', {
          max: filterOptions.mcvLeadScore.max,
        });
      }
    }

    const companies = await queryBuilder.getManyAndCount();

    return {
      items: this.companyMapper.mapMany(companies[0]),
      count: companies[1],
    };
  }

  public async getCompanies(options?: {
    orderBy?: DataWarehouseCompanyOrderBy;
    direction?: 'ASC' | 'DESC';
    skip?: number;
    take?: number;
    domains?: string[];
  }): Promise<Partial<CompanyDto>[]> {
    this.logger.debug(
      `Getting companies from data warehouse, options: ${JSON.stringify(
        options,
      )}`,
    );

    const findOptions: FindManyOptions<CompanyDwhEntity> = {};
    if (DWH_COMPANY_SELECT_COLUMNS && !!DWH_COMPANY_SELECT_COLUMNS.length) {
      findOptions.select = DWH_COMPANY_SELECT_COLUMNS;
    }
    findOptions.where = {
      domain: And(Not(''), Not(IsNull())),
    };

    if (options?.orderBy) {
      findOptions.order = {
        [options?.orderBy]: options?.direction ?? 'ASC',
      };
    }

    if (options?.skip) {
      findOptions.skip = options?.skip;
    }

    if (options?.take) {
      findOptions.take = options?.take;
    }

    if (options?.domains) {
      findOptions.where.domain = In(options?.domains);
    }

    const companyResult = await this.companyRepository.find(findOptions);

    const companyIds = companyResult.map((company) => company.companyId);

    const numberOfEmployees = await this.getNumberOfEmployees(companyIds);

    const tags = await this.getTags(companyIds);

    const fundingRounds = await this.getFundingRounds(companyIds);

    const mapped = this.companyMapper.mapMany(
      companyResult,
      numberOfEmployees,
      tags,
      fundingRounds,
    );

    return mapped;
  }

  public async getCount(): Promise<number> {
    return this.companyRepository.count({
      where: {
        domain: And(Not(''), Not(IsNull())),
      },
    });
  }

  public async getFounders(options?: {
    orderBy?: DataWarehouseFounderOrderBy;
    direction?: 'ASC' | 'DESC';
    skip?: number;
    take?: number;
  }): Promise<(FounderDto | FounderDto[])[]> {
    const findOptions: FindManyOptions<FounderDwhEntity> = {};

    findOptions.where = {
      name: And(Not(''), Not(IsNull())),
    };

    if (options?.orderBy) {
      findOptions.order = {
        [options?.orderBy]: options?.direction ?? 'ASC',
      };
    }

    if (options?.skip) {
      findOptions.skip = options?.skip;
    }

    if (options?.take) {
      findOptions.take = options?.take;
    }

    const entities = await this.founderRepository.find(findOptions);

    const grouped = this.groupEntities(entities, 'name');

    return this.founderMapper.mapMany(grouped);
  }

  public async getIndustries(): Promise<string[]> {
    const chunkSize = 10000;

    const count = await this.companyRepository.count();

    const chunks = Math.ceil(count / chunkSize);

    const industries: string[] = [];

    for (let i = 0; i < chunks; i++) {
      const offset = i * chunkSize;
      const companies = await this.companyRepository.find({
        select: ['specterIndustry'],
        where: {
          specterIndustry: Not(IsNull()),
        },
        skip: offset,
        take: chunkSize,
      });
      const industriesFlattened = companies.flatMap((i) =>
        i.specterIndustry.split('; '),
      );
      industries.push(...new Set([...industriesFlattened]));
    }

    for (let i = 0; i < chunks; i++) {
      const offset = i * chunkSize;
      const companies = await this.companyRepository.find({
        select: ['specterSubIndustry'],
        where: {
          specterSubIndustry: Not(IsNull()),
        },
        skip: offset,
        take: chunkSize,
      });
      const industriesFlattened = companies.flatMap((i) =>
        i.specterSubIndustry.split('; '),
      );
      industries.push(...industriesFlattened);
    }

    const industriesFlattenedDistinct = [...new Set([...industries])];

    return industriesFlattenedDistinct;
  }

  public async getInvestors(): Promise<string[]> {
    const chunkSize = 10000;

    const count = await this.companyRepository.count();

    const chunks = Math.ceil(count / chunkSize);

    const investors: string[] = [];

    for (let i = 0; i < chunks; i++) {
      const offset = i * chunkSize;
      const companies = await this.companyRepository.find({
        select: ['specterInvestors'],
        where: {
          specterInvestors: Not(IsNull()),
        },
        skip: offset,
        take: chunkSize,
      });
      const investorsFlattened = companies.flatMap((i) =>
        i.specterInvestors.split('; '),
      );
      investors.push(...new Set([...investorsFlattened]));
    }

    const investorsFlattenedDistinct = [...new Set([...investors])];

    return investorsFlattenedDistinct;
  }

  private async getNumberOfEmployees(
    companyIds: number[],
  ): Promise<GroupedEntity<DealroomCompanyNumberOfEmployeesDwhEntity>[]> {
    const entities = await this.dealroomCompanyNumberOfEmployeesRepository.find(
      {
        where: {
          companyId: In(companyIds),
        },
      },
    );

    const grouped = this.groupEntities(entities, 'companyId');

    return grouped;
  }

  private groupEntities<T>(entities: T[], idKey: string): GroupedEntity<T>[] {
    const grouped: GroupedEntity<T>[] = [];

    for (const entity of entities) {
      const existing = grouped.find((g) => g.id === entity[idKey]);
      if (existing) {
        existing.entities.push(entity);
      } else {
        grouped.push({
          id: entity[idKey],
          entities: [entity],
        });
      }
    }

    return grouped;
  }

  private async getTags(
    companyIds: number[],
  ): Promise<GroupedEntity<DealroomCompanyTagEntity>[]> {
    const entities = await this.dealroomCompanyTagRepository.find({
      where: {
        companyId: In(companyIds),
      },
    });

    const grouped = this.groupEntities(entities, 'companyId');

    return grouped;
  }

  private async getFundingRounds(
    companyIds: number[],
  ): Promise<GroupedEntity<DealroomFundingRoundEntity>[]> {
    const entities = await this.dealroomFundingRoundRepository.find({
      where: {
        companyId: In(companyIds),
      },
    });

    const grouped = this.groupEntities(entities, 'companyId');

    return grouped;
  }
}
