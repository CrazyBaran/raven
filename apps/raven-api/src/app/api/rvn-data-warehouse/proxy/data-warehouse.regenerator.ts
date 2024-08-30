import { TagTypeEnum } from '@app/rvns-tags';
import { IndustryDto } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FundManagerOrganisationEntity } from '../../rvn-fund-managers/entities/fund-manager-organisation.entity';
import { FundManagerEntity } from '../../rvn-fund-managers/entities/fund-manager.entity';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { OrganisationDomainEntity } from '../../rvn-opportunities/entities/organisation-domain.entity';
import { OrganisationEntity } from '../../rvn-opportunities/entities/organisation.entity';
import { PrimaryDataSource } from '../../rvn-opportunities/interfaces/get-organisations.options';
import { OrganisationTagEntity } from '../../rvn-tags/entities/tag.entity';
import { TagEntityFactory } from '../../rvn-tags/tag-entity.factory';
import { DomainResolver } from '../../rvn-utils/domain.resolver';
import { DataWarehouseCacheService } from '../cache/data-warehouse-cache.service';
import { DataWarehouseAccessBase } from '../interfaces/data-warehouse.access.base';
import { DataWarehouseCompaniesIndustryV1Entity } from './entities/data-warehouse-company-industries.v1.entity';
import { DataWarehouseCompaniesInvestorV1Entity } from './entities/data-warehouse-company-investors.v1.entity';
import { DataWarehouseCompanyV1Entity } from './entities/data-warehouse-company.v1.entity';

interface CreateOrganisationOptions {
  initialDataSource?: PrimaryDataSource;
  name: string;
  domain: string;
  createOpportunity?: boolean;
  investorId?: string;
}

@Injectable()
export class DataWarehouseRegenerator {
  public constructor(
    private readonly logger: RavenLogger,
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    @InjectRepository(DataWarehouseCompanyV1Entity)
    private readonly dataWarehouseCompanyV1Repository: Repository<DataWarehouseCompanyV1Entity>,
    @InjectRepository(DataWarehouseCompaniesIndustryV1Entity)
    private readonly dataWarehouseCompaniesIndustryV1Repository: Repository<DataWarehouseCompaniesIndustryV1Entity>,
    @InjectRepository(DataWarehouseCompaniesInvestorV1Entity)
    private readonly dataWarehouseCompaniesInvestorV1Repository: Repository<DataWarehouseCompaniesInvestorV1Entity>,
    private readonly dataWarehouseCacheService: DataWarehouseCacheService,
    private readonly dataWarehouseAccessService: DataWarehouseAccessBase,
    @InjectRepository(OrganisationTagEntity)
    private readonly tagsRepository: Repository<OrganisationTagEntity>,
    @InjectRepository(FundManagerEntity)
    private readonly fundManagersRepository: Repository<FundManagerEntity>,
    @InjectRepository(FundManagerOrganisationEntity)
    private readonly fundManagerOrganisationRepository: Repository<FundManagerOrganisationEntity>,
    private readonly domainResolver: DomainResolver,
  ) {
    this.logger.setContext(DataWarehouseRegenerator.name);
  }
  public async regenerateProxy(
    skip: number,
    take: number,
    progressCallback?: (progress: number) => Promise<void>,
  ): Promise<void> {
    const fetchChunkSize = 2000;
    const organisations: OrganisationEntity[] = [];
    for (let i = 0; i < take; i += fetchChunkSize) {
      organisations.push(
        ...(await this.organisationRepository.find({
          relations: ['organisationDomains'],
          skip: skip + i,
          take: fetchChunkSize,
          order: { id: 'ASC' },
        })),
      );
    }

    const internalChunkSize = 100;
    for (let i = 0; i < organisations.length; i += internalChunkSize) {
      const chunk = organisations.slice(i, i + internalChunkSize);
      try {
        await this.regenerateChunk(chunk, progressCallback);
      } catch (error) {
        this.logger.error(
          `Error regenerating chunk: ${error.message}`,
          error.stack,
        );
      }
      await progressCallback?.(
        ((i + internalChunkSize) / organisations.length) * 100.0,
      );
    }
  }

  public async regenerateIndustries(): Promise<void> {
    const industries = await this.dataWarehouseAccessService.getIndustries();
    const existingIndustries =
      await this.dataWarehouseCompaniesIndustryV1Repository.find();
    const newIndustries = industries.filter(
      (industry) =>
        !existingIndustries.some((existing) => existing.name === industry),
    );
    await this.dataWarehouseCompaniesIndustryV1Repository.insert(
      newIndustries.map((industry) =>
        this.dataWarehouseCompaniesIndustryV1Repository.create({
          name: industry,
        }),
      ),
    );
  }

  public async regenerateFundManagers(): Promise<void> {
    const investors = await this.dataWarehouseAccessService.getFundManagers();
    for (let j = 0; j < investors.length; j++) {
      const domain = investors[j].domain;
      const name = investors[j].investorName;
      const isPortfolio = investors[j].isPortfolio;

      const currentOrganisation = await this.createInvestorOrganisation({
        domain: domain,
        name: name,
        initialDataSource: 'investors_dwh',
      });
      const invTags = await this.tagsRepository.find({
        where: {
          name: name,
          type: In([TagTypeEnum.Investor]),
        },
      });
      if (invTags.length) {
        for (const cT of invTags) {
          cT.organisationId = currentOrganisation.id;
          await this.tagsRepository.save(cT);
        }
      } else {
        const newTag = TagEntityFactory.createTag({
          name: name,
          type: TagTypeEnum.Investor,
          organisationId: currentOrganisation.id,
        });

        await this.tagsRepository.save(newTag);
      }

      let fm = new FundManagerEntity();
      if (currentOrganisation.fundManagerId) {
        fm = await this.fundManagersRepository.findOne({
          where: { id: currentOrganisation.fundManagerId },
        });
      } else {
        fm.name = name;
      }
      fm.domain = domain;
      fm.isPortfolio =
        isPortfolio === '0' || Number(isPortfolio) === 0 ? false : true;

      const fundManager = await this.fundManagersRepository.save(fm);

      const [investments, _count] =
        await this.dataWarehouseAccessService.getFundManagerInvestments(domain);
      const parsedOrgs = await this.organisationRepository.find({
        relations: ['organisationDomains'],
        where: {
          organisationDomains: {
            domain: In(
              investments.map((i) =>
                this.domainResolver.cleanDomain(i.companyDomain),
              ),
            ),
          },
        },
      });
      for (const org of parsedOrgs) {
        await this.fundManagerOrganisationRepository.save(
          FundManagerOrganisationEntity.create({
            fundManagerId: fundManager.id,
            organisationId: org.id,
          }),
        );
      }
      await this.organisationRepository.save({
        id: currentOrganisation.id,
        fundManagerId: fm.id,
      });
    }
  }

  public async regenerateInvestors(): Promise<void> {
    const investors = await this.dataWarehouseAccessService.getInvestors();
    const chunkSize = 1000;

    for (let i = 0; i < investors.length; i += chunkSize) {
      const chunk = investors.slice(i, i + chunkSize);

      const existingInvestors =
        await this.dataWarehouseCompaniesInvestorV1Repository.find({
          where: {
            name: In(chunk),
          },
        });

      const newInvestors = chunk.filter(
        (investor) =>
          !existingInvestors.some((existing) => existing.name === investor),
      );

      if (newInvestors.length > 0) {
        try {
          await this.dataWarehouseCompaniesInvestorV1Repository.insert(
            newInvestors.map((investor) =>
              this.dataWarehouseCompaniesInvestorV1Repository.create({
                name: investor,
              }),
            ),
          );
        } catch (error) {
          this.logger.error(
            `Error inserting investors: ${error.message}`,
            error.stack,
          );
        }
      }
    }
  }

  protected async createInvestorOrganisation(
    options: CreateOrganisationOptions,
  ): Promise<OrganisationEntity> {
    const existingOrganisation = await this.organisationRepository.findOne({
      relations: ['organisationDomains'],
      where: {
        organisationDomains: {
          domain: In(this.domainResolver.extractDomains(options.domain)),
        },
      },
    });

    if (existingOrganisation) {
      return existingOrganisation;
    }

    return await this.organisationRepository.manager.transaction(
      async (tem) => {
        const organisation = new OrganisationEntity();
        organisation.name = options.name;
        organisation.initialDataSource = options.initialDataSource;

        const organisationEntity = await tem.save(organisation);

        const cleanedDomains = this.domainResolver.extractDomains(
          options.domain,
        );
        for (const singleDomain of cleanedDomains) {
          const organisationDomain = new OrganisationDomainEntity();
          organisationDomain.organisation = organisationEntity;
          organisationDomain.organisationId = organisationEntity.id;
          organisationDomain.domain = singleDomain;
          await tem.save(organisationDomain);
        }

        await tem.findOne(OrganisationEntity, {
          where: { id: organisationEntity.id },
          relations: ['organisationDomains'],
        });

        return organisationEntity;
      },
    );
  }

  private async findCorrespondingInvestors(
    investors: string[],
  ): Promise<DataWarehouseCompaniesInvestorV1Entity[]> {
    if (!investors) {
      return [];
    }

    const existingInvestors =
      await this.dataWarehouseCompaniesInvestorV1Repository.find({
        where: {
          name: In(investors),
        },
      });
    return existingInvestors;
  }

  private async findCorrespondingIndustries(
    industry: IndustryDto,
  ): Promise<DataWarehouseCompaniesIndustryV1Entity[]> {
    if (!industry) {
      return [];
    }
    if (!industry.industries) {
      return [];
    }

    const existingIndustries =
      await this.dataWarehouseCompaniesIndustryV1Repository.find({
        where: {
          name: In(industry.industries),
        },
      });
    return existingIndustries;
  }

  private async regenerateChunk(
    chunk: OrganisationEntity[],
    progressCallback: (progress: number) => Promise<void>,
  ): Promise<void> {
    const data: DataWarehouseCompanyV1Entity[] = [];
    for (const organisation of chunk) {
      const correspondingCacheEntries =
        await this.dataWarehouseCacheService.getCompanies(organisation.domains);

      const entry = correspondingCacheEntries[0];
      data.push(
        this.dataWarehouseCompanyV1Repository.create({
          organisationId: organisation.id,
          mcvLeadScore: entry?.mcvLeadScore,
          name: entry?.name,
          fundingLastFundingAmount: entry?.funding?.lastFundingAmount,
          fundingLastFundingDate: entry?.funding?.lastFundingDate,
          fundingTotalFundingAmount: entry?.funding?.totalFundingAmount,
          fundingLastFundingRound: entry?.funding?.lastFundingRound,
          hqCountry: entry?.hq.country,
          data: JSON.stringify(entry),
          specterLastUpdated: entry?.specterLastUpdated,
          dealRoomLastUpdated: entry?.dealRoomLastUpdated,
          lastRefreshedUtc: entry?.lastRefreshedUtc,
          investors: await this.findCorrespondingInvestors(
            entry?.actors.investors,
          ),
          industries: await this.findCorrespondingIndustries(entry?.industry),
        }),
      );
    }

    // delete existing data by the organisation ids to be pushed
    await this.dataWarehouseCompanyV1Repository.delete(
      chunk.map((organisation) => organisation.id),
    );

    await this.dataWarehouseCompanyV1Repository.save(data);
  }
}
