import {
  CompanyDto,
  DataWarehouseCompanyOrderBy,
  GroupedEntity,
} from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { And, FindManyOptions, In, IsNull, Not, Repository } from 'typeorm';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { DataWarehouseAccessBase } from '../interfaces/data-warehouse.access.base';
import { InjectDataWarehouseRepository } from '../utils/inject-data-warehouse-repository.decorator';
import { DWH_V1_COMPANY_SELECT_COLUMNS } from './data-warehouse.v1.const';
import { CompanyV1DwhEntity } from './entities/company.v1.dwh.entity';
import { DealroomCompanyNumberOfEmployeesDwhEntity } from './entities/dealroom-company-number-of-employees.dwh.entity';
import { DealroomCompanyTagEntity } from './entities/dealroom-company-tags.dwh.entity';
import { DealroomFundingRoundEntity } from './entities/dealroom-funding-rounds.dwh.entity';
import { CompanyV1Mapper } from './mappers/company.v1.mapper';

@Injectable()
export class DataWarehouseV1AccessService implements DataWarehouseAccessBase {
  public constructor(
    private readonly logger: RavenLogger,
    @InjectDataWarehouseRepository(CompanyV1DwhEntity)
    private readonly companyRepository: Repository<CompanyV1DwhEntity>,
    @InjectDataWarehouseRepository(DealroomCompanyNumberOfEmployeesDwhEntity)
    private readonly dealroomCompanyNumberOfEmployeesRepository: Repository<DealroomCompanyNumberOfEmployeesDwhEntity>,
    @InjectDataWarehouseRepository(DealroomCompanyTagEntity)
    private readonly dealroomCompanyTagRepository: Repository<DealroomCompanyTagEntity>,
    @InjectDataWarehouseRepository(DealroomFundingRoundEntity)
    private readonly dealroomFundingRoundRepository: Repository<DealroomFundingRoundEntity>,
    private readonly companyMapper: CompanyV1Mapper,
  ) {
    this.logger.setContext(DataWarehouseV1AccessService.name);
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

    const lastRefreshedUtc = await this.companyRepository.findOne({
      order: {
        lastRefreshedUtc: 'DESC',
      },
      where: {
        lastRefreshedUtc: Not(IsNull()),
      },
    });

    return {
      lastUpdated: lastRefreshedUtc.lastRefreshedUtc,
      specter: lastUpdatedSpecter.specterLastUpdated,
      dealRoom: lastUpdatedDealRoom.dealRoomLastUpdated,
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

    const findOptions: FindManyOptions<CompanyV1DwhEntity> = {};
    if (
      DWH_V1_COMPANY_SELECT_COLUMNS &&
      !!DWH_V1_COMPANY_SELECT_COLUMNS.length
    ) {
      findOptions.select = DWH_V1_COMPANY_SELECT_COLUMNS;
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
