import {
  CompanyDto,
  DataWarehouseCompanyOrderBy,
} from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { And, FindManyOptions, In, IsNull, Not, Repository } from 'typeorm';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { DataWarehouseAccessBase } from '../interfaces/data-warehouse.access.base';
import { InjectDataWarehouseRepository } from '../utils/inject-data-warehouse-repository.decorator';
import { DWH_V2_COMPANY_SELECT_COLUMNS } from './data-warehouse.v2.const';
import { CompanyV2DwhEntity } from './entities/company.v2.dwh.entity';
import { CompanyV2Mapper } from './mappers/company.v2.mapper';

@Injectable()
export class DataWarehouseV2AccessService implements DataWarehouseAccessBase {
  public constructor(
    private readonly logger: RavenLogger,
    @InjectDataWarehouseRepository(CompanyV2DwhEntity)
    private readonly companyRepository: Repository<CompanyV2DwhEntity>,
    private readonly companyMapper: CompanyV2Mapper,
  ) {}
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

    const findOptions: FindManyOptions<CompanyV2DwhEntity> = {};
    if (
      DWH_V2_COMPANY_SELECT_COLUMNS &&
      !!DWH_V2_COMPANY_SELECT_COLUMNS.length
    ) {
      findOptions.select = DWH_V2_COMPANY_SELECT_COLUMNS;
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

    const mapped = this.companyMapper.mapMany(companyResult);

    return mapped;
  }
  public getCount(): Promise<number> {
    return this.companyRepository.count({
      where: {
        domain: And(Not(''), Not(IsNull())),
      },
    });
  }
  public async getIndustries(
    progressCallback?: (progress: number) => Promise<void>,
  ): Promise<string[]> {
    const chunkSize = 10000;

    const count = await this.getCount();

    const chunks = Math.ceil(count / chunkSize);

    const industries: string[] = [];

    for (let i = 0; i < chunks; i++) {
      const offset = i * chunkSize;
      const companies = await this.companyRepository.find({
        select: ['industries'],
        where: {
          industries: Not(IsNull()),
        },
        skip: offset,
        take: chunkSize,
      });
      const industriesFlattened = companies.flatMap((i) =>
        i.industries.split('; '),
      );
      industries.push(...new Set([...industriesFlattened]));

      await progressCallback?.(Math.floor((i / chunks) * 100));
    }

    const industriesFlattenedDistinct = [...new Set([...industries])];

    return industriesFlattenedDistinct;
  }
  public async getInvestors(
    progressCallback?: (progress: number) => Promise<void>,
  ): Promise<string[]> {
    const chunkSize = 10000;

    const count = await this.getCount();

    const chunks = Math.ceil(count / chunkSize);

    const investors: string[] = [];

    for (let i = 0; i < chunks; i++) {
      const offset = i * chunkSize;
      const companies = await this.companyRepository.find({
        select: ['investors'],
        where: {
          investors: Not(IsNull()),
        },
        skip: offset,
        take: chunkSize,
      });
      const investorsFlattened = companies.flatMap((i) =>
        i.investors.split('; '),
      );
      investors.push(...new Set([...investorsFlattened]));

      await progressCallback?.(Math.floor((i / chunks) * 100));
    }

    const investorsFlattenedDistinct = [...new Set([...investors])];

    return investorsFlattenedDistinct;
  }
}
