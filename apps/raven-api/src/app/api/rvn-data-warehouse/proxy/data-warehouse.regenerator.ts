import { IndustryDto } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { OrganisationEntity } from '../../rvn-opportunities/entities/organisation.entity';
import { DataWarehouseCacheService } from '../cache/data-warehouse-cache.service';
import { DataWarehouseAccessBase } from '../interfaces/data-warehouse.access.base';
import { DataWarehouseCompaniesIndustryV1Entity } from './entities/data-warehouse-company-industries.v1.entity';
import { DataWarehouseCompaniesInvestorV1Entity } from './entities/data-warehouse-company-investors.v1.entity';
import { DataWarehouseCompanyV1Entity } from './entities/data-warehouse-company.v1.entity';

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

  public async clearProxy(): Promise<void> {
    await this.dataWarehouseCompanyV1Repository.delete({
      organisationId: Not(IsNull()),
    });
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

    await this.dataWarehouseCompanyV1Repository.save(data);
  }
}
