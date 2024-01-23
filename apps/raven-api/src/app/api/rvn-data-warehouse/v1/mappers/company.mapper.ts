import {
  CompanyDto,
  DealRoomGrowthStage,
  GrowthStageDto,
  SpecterGrowthStage,
} from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { GroupedEntity } from '../../interfaces/grouped-entity.interface';
import { DataWarehouseParser } from '../../utils/data-warehouse.parser';
import { CompanyEntity } from '../entities/company.entity';
import { DealroomCompanyNumberOfEmployeesEntity } from '../entities/dealroom-company-number-of-employees.entity';
import { DealroomCompanyTagEntity } from '../entities/dealroom-company-tags.entity';
import { DealroomFundingRoundEntity } from '../entities/dealroom-funding-rounds.entity';
import { FounderMapper } from './founder.mapper';
import { FundingRoundMapper } from './funding-round.mapper';
import { InvestorMapper } from './investor.mapper';
import { NumberOfEmployeesMapper } from './number-of-employees.mapper';

@Injectable()
export class CompanyMapper {
  public constructor(
    private readonly numberOfEmployeesMapper: NumberOfEmployeesMapper,
    private readonly fundingRoundMapper: FundingRoundMapper,
    private readonly investorMapper: InvestorMapper,
    private readonly founderMapper: FounderMapper,
  ) {}

  public map(
    entity: CompanyEntity,
    numberOfEmployees: GroupedEntity<DealroomCompanyNumberOfEmployeesEntity>,
    tags: GroupedEntity<DealroomCompanyTagEntity>,
    fundingRounds: GroupedEntity<DealroomFundingRoundEntity>,
  ): CompanyDto {
    return {
      dealRoomId: entity.companyId,
      domain: entity.domain,
      name: entity.name,
      description: entity.description,
      tagline: entity.tagline,
      foundedYear: entity.foundedYear,
      growthStage: this.calculateGrowthStage(
        entity.specterGrowthStage as SpecterGrowthStage,
        entity.dealRoomGrowthStage as DealRoomGrowthStage,
      ),
      industry: {
        industries: DataWarehouseParser.parseSemicolonData(
          entity.specterIndustry,
        ),
        subIndustries: DataWarehouseParser.parseSemicolonData(
          entity.specterSubIndustry,
        ),
      },
      hq: {
        location: entity.specterHqLocation,
        region: entity.specterHqRegion,
      },
      numberOfEmployees: this.numberOfEmployeesMapper.mapMany(
        numberOfEmployees?.entities,
      ),
      tags: tags?.entities.map((t) => t.tag),
      fundingRounds: fundingRounds?.entities.map((fundingRound) =>
        this.fundingRoundMapper.map(fundingRound),
      ),
      funding: {
        totalFundingAmount: entity.totalFundingAmount,
        lastFundingAmount: entity.lastFundingAmount,
        lastFundingDate: entity.lastFundingDate,
        lastFundingType: entity.specterLastFundingType,
      },

      postMoneyValuation: entity.postMoneyValuation,
      actors: {
        founders: DataWarehouseParser.parseSemicolonData(
          entity.specterFounders,
        ),
        investors: DataWarehouseParser.parseSemicolonData(
          entity.specterInvestors,
        ),
      },
      acquisition: {
        acquiredBy: entity.acquiredBy,
        acquisitionDate: entity.acquisitionDate,
        acquisitionPrice: entity.acquisitionPrice,
      },
    };
  }

  public mapMany(
    entities: CompanyEntity[],
    numberOfEmployees: GroupedEntity<DealroomCompanyNumberOfEmployeesEntity>[],
    tags: GroupedEntity<DealroomCompanyTagEntity>[],
    fundingRounds: GroupedEntity<DealroomFundingRoundEntity>[],
  ): CompanyDto[] {
    return entities.map((entity) =>
      this.map(
        entity,
        numberOfEmployees.find((g) => g.id === entity.companyId),
        tags.find((g) => g.id === entity.companyId),
        fundingRounds.find((g) => g.id === entity.companyId),
      ),
    );
  }

  private calculateGrowthStage(
    specterGrowthStage: SpecterGrowthStage,
    dealRoomGrowthStage: DealRoomGrowthStage,
  ): GrowthStageDto {
    const evaluated = '';
    return {
      specter: specterGrowthStage,
      dealRoom: dealRoomGrowthStage,
      evaluated: evaluated,
    };
  }
}
