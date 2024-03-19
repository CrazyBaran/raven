import {
  CompanyDto,
  ContactDto,
  DataWarehouseCompanyOrderBy,
  FundingRoundDto,
  NewsDto,
  NumberOfEmployeesSnapshotDto,
} from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { PagedData } from 'rvns-shared';
import { And, FindManyOptions, In, IsNull, Not, Repository } from 'typeorm';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { DataWarehouseAccessBase } from '../interfaces/data-warehouse.access.base';
import { InjectDataWarehouseRepository } from '../utils/inject-data-warehouse-repository.decorator';
import {
  CompanyV2DwhEntity,
  DWH_V2_COMPANY_SELECT_COLUMNS,
} from './entities/company.v2.dwh.entity';
import { ContactV2DwhEntity } from './entities/contact.v2.dwh.entity';
import { EmployeesV2DwhEntity } from './entities/employees.v2.dwh.entity';
import { FundingRoundV2DwhEntity } from './entities/funding-round.v2.dwh.entity';
import { NewsV2DwhEntity } from './entities/news.v2.dwh.entity';
import { CompanyV2Mapper } from './mappers/company.v2.mapper';
import { ContactV2Mapper } from './mappers/contact.v2.mapper';
import { EmployeesV2Mapper } from './mappers/employees.v2.mapper';
import { FundingRoundV2Mapper } from './mappers/funding-round.v2.mapper';
import { NewsV2Mapper } from './mappers/news.v2.mapper';

@Injectable()
export class DataWarehouseV2AccessService implements DataWarehouseAccessBase {
  public constructor(
    private readonly logger: RavenLogger,
    @InjectDataWarehouseRepository(CompanyV2DwhEntity)
    private readonly companyRepository: Repository<CompanyV2DwhEntity>,
    private readonly companyMapper: CompanyV2Mapper,
    @InjectDataWarehouseRepository(ContactV2DwhEntity)
    private readonly contactRepository: Repository<ContactV2DwhEntity>,
    private readonly contactMapper: ContactV2Mapper,
    @InjectDataWarehouseRepository(EmployeesV2DwhEntity)
    private readonly employeesRepository: Repository<EmployeesV2DwhEntity>,
    private readonly employeesMapper: EmployeesV2Mapper,
    @InjectDataWarehouseRepository(FundingRoundV2DwhEntity)
    private readonly fundingRoundRepository: Repository<FundingRoundV2DwhEntity>,
    private readonly fundingRoundMapper: FundingRoundV2Mapper,
    @InjectDataWarehouseRepository(NewsV2DwhEntity)
    private readonly newsRepository: Repository<NewsV2DwhEntity>,
    private readonly newsMapper: NewsV2Mapper,
  ) {
    this.logger.setContext(DataWarehouseV2AccessService.name);
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
    const companies = await this.findAndMapCompanies(options);

    // TODO: improve performance, this cannot take place for now
    // await this.enrichCompanies(companies);

    return companies;
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

  public async findAndMapCompanies(options: {
    orderBy?: DataWarehouseCompanyOrderBy;
    direction?: 'ASC' | 'DESC';
    skip?: number;
    take?: number;
    domains?: string[];
  }): Promise<Partial<CompanyDto>[]> {
    const findOptions: FindManyOptions<CompanyV2DwhEntity> = {};

    findOptions.select = DWH_V2_COMPANY_SELECT_COLUMNS;

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

  public async findAndMapContacts(
    domains: string[],
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<ContactDto>>> {
    const options = {
      where: {
        domain: In(domains),
      },
      skip: skip ? skip : 0,
      take: take ? take : 100,
    } as FindManyOptions<ContactV2DwhEntity>;

    const [contacts, total] =
      await this.contactRepository.findAndCount(options);

    const mapped = this.contactMapper.mapMany(contacts);

    return {
      items: mapped,
      total: total,
    };
  }

  public async findAndMapEmployees(
    domains: string[],
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<NumberOfEmployeesSnapshotDto>>> {
    const options = {
      where: {
        domain: In(domains),
      },
      skip: skip ? skip : 0,
      take: take ? take : 100,
      order: {
        observationDate: 'DESC',
      },
    } as FindManyOptions<EmployeesV2DwhEntity>;

    const [employees, total] =
      await this.employeesRepository.findAndCount(options);

    const mapped = this.employeesMapper.mapMany(employees);

    return {
      items: mapped,
      total: total,
    };
  }

  public async findAndMapFundingRounds(
    domains: string[],
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<FundingRoundDto>>> {
    const options = {
      where: {
        domain: In(domains),
      },
      skip: skip ? skip : 0,
      take: take ? take : 100,
      order: {
        date: 'DESC',
      },
    } as FindManyOptions<FundingRoundV2DwhEntity>;

    const [fundingRounds, total] =
      await this.fundingRoundRepository.findAndCount(options);

    const mapped = this.fundingRoundMapper.mapMany(fundingRounds);

    return {
      items: mapped,
      total: total,
    };
  }

  public async findAndMapNews(
    domains: string[],
    skip?: number,
    take?: number,
  ): Promise<PagedData<Partial<NewsDto>>> {
    const options = {
      where: {
        domain: In(domains),
      },
      skip: skip ? skip : 0,
      take: take ? take : 100,
      order: {
        publicationDate: 'DESC',
      },
    } as FindManyOptions<NewsV2DwhEntity>;

    const [news, total] = await this.newsRepository.findAndCount(options);

    const mapped = this.newsMapper.mapMany(news);

    return {
      items: mapped,
      total: total,
    };
  }

  private async enrichCompanies(
    companies: Partial<CompanyDto>[],
  ): Promise<void> {
    const domains = companies.map((i) => i.domain);

    const contacts = await this.findAndMapContacts(domains);
    const employees = await this.findAndMapEmployees(domains);
    const fundingRounds = await this.findAndMapFundingRounds(domains);
    const news = await this.findAndMapNews(domains);

    companies.forEach((company) => {
      company.contacts = contacts.items.filter(
        (i) => i.domain === company.domain,
      );
      company.numberOfEmployees = employees.items.filter(
        (i) => i.domain === company.domain,
      );
      company.fundingRounds = fundingRounds.items.filter(
        (i) => i.domain === company.domain,
      );
      company.news = news.items.filter((i) => i.domain === company.domain);
    });
  }
}
