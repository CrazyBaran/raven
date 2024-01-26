import { CompanyDto, FounderDto } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { And, FindManyOptions, In, IsNull, Not, Repository } from 'typeorm';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { DataWarehouseAccess } from '../interfaces/data-warehouse-access.interface';
import { DataWarehouseCompanyOrderBy } from '../interfaces/data-warehouse-company-order-by.type';
import { DataWarehouseFounderOrderBy } from '../interfaces/data-warehouse-founder-order-by.type';
import { GroupedEntity } from '../interfaces/grouped-entity.interface';
import { InjectDataWarehouseRepository } from '../utils/inject-data-warehouse-repository.decorator';
import { CompanyDwhEntity } from './entities/company.dwh.entity';
import { DealroomCompanyNumberOfEmployeesDwhEntity } from './entities/dealroom-company-number-of-employees.dwh.entity';
import { DealroomCompanyTagEntity } from './entities/dealroom-company-tags.dwh.entity';
import { DealroomFundingRoundEntity } from './entities/dealroom-funding-rounds.dwh.entity';
import { FounderDwhEntity } from './entities/founder.dwh.entity';
import { InvestorDwhEntity } from './entities/investor.dwh.entity';
import { CompanyMapper } from './mappers/company.mapper';
import { FounderMapper } from './mappers/founder.mapper';

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

  public async getCompanies(options?: {
    orderBy?: DataWarehouseCompanyOrderBy;
    direction?: 'ASC' | 'DESC';
    skip?: number;
    take?: number;
    domains?: string[];
  }): Promise<CompanyDto[]> {
    this.logger.debug(
      `Getting companies from data warehouse, options: ${JSON.stringify(
        options,
      )}`,
    );
    const findOptions: FindManyOptions<CompanyDwhEntity> = {};

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
