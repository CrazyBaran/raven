import {
  CompanyDto,
  DealRoomGrowthStage,
  GroupedEntity,
  GrowthStageDto,
  IpoDetailsDto,
  SpecterGrowthStage,
} from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { DataWarehouseParser } from '../../utils/data-warehouse.parser';
import { CompanyDwhEntity } from '../entities/company.dwh.entity';
import { DealroomCompanyNumberOfEmployeesDwhEntity } from '../entities/dealroom-company-number-of-employees.dwh.entity';
import { DealroomCompanyTagEntity } from '../entities/dealroom-company-tags.dwh.entity';
import { DealroomFundingRoundEntity } from '../entities/dealroom-funding-rounds.dwh.entity';
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
    entity: CompanyDwhEntity,
    numberOfEmployees: GroupedEntity<DealroomCompanyNumberOfEmployeesDwhEntity>,
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
      ipoDetails: this.parseJson<IpoDetailsDto[]>(entity.ipoDetails),
      companySize: entity.companySize,
      webVisits: entity.webVisits,
      topCountry: entity.topCountry,
      countryBreakdown: DataWarehouseParser.parseSemicolonKeyValue(
        entity.countryBreakdown,
      ),
      trafficSources: DataWarehouseParser.parseSemicolonKeyValue(
        entity.trafficSources,
      ),
      socialTrafficBreakdown: DataWarehouseParser.parseSemicolonKeyValue(
        entity.socialTrafficBreakdown,
      ),
      organicSearchPercentage: entity.organicSearchPercentage,
      paidSearchPercentage: entity.paidSearchPercentage,
      bounceRate: entity.bounceRate,
      sessionDuration: entity.sessionDuration,
      pagesPerVisit: entity.pagesPerVisit,
      similarWebsitesAndSimilarity: DataWarehouseParser.parseSemicolonKeyValue(
        entity.similarWebsitesAndSimilarity,
      ),
      websitePopularityRank: entity.websitePopularityRank,
      urls: {
        dealRoomUrl: entity.dealRoomUrl,
        crunchBaseUrl: entity.crunchBaseUrl,
        angelListUrl: entity.angelListUrl,
        facebookUrl: entity.facebookUrl,
        googleUrl: entity.googleUrl,
        linkedInUrl: entity.linkedInUrl,
        twitterUrl: entity.twitterUrl,
        instagramUrl: entity.instagramUrl,
        linkedInFollowers: entity.linkedInFollowers,
        twitterFollowers: entity.twitterFollowers,
        instagramFollowers: entity.instagramFollowers,
        instagramFollowing: entity.instagramFollowing,
        totalAppDownloads: entity.totalAppDownloads,
        iTunesUrl: entity.iTunesUrl,
        iTunesAppId: entity.iTunesAppId,
        iTunesRating: entity.iTunesRating,
        iTunesReviews: entity.iTunesReviews,
        googlePlayUrl: entity.googlePlayUrl,
        googlePlayAppId: entity.googlePlayAppId,
        googlePlayRating: entity.googlePlayRating,
        googlePlayReviews: entity.googlePlayReviews,
        googlePlayInstalls: entity.googlePlayInstalls,
      },
      numberOfTrademarks: entity.numberOfTrademarks,
      numberOfPatents: entity.numberOfPatents,
      companyEmail: entity.specterCompanyEmail,
      companyPhoneNumber: entity.specterCompanyPhoneNumber,
      deliveryMethod: entity.dealRoomDeliveryMethod,
      specterRank: entity.specterRank,
      specterLastUpdated: entity.specterLastUpdated,
      dealRoomLastUpdated: entity.dealRoomLastUpdated,
    };
  }

  public mapMany(
    entities: CompanyDwhEntity[],
    numberOfEmployees?: GroupedEntity<DealroomCompanyNumberOfEmployeesDwhEntity>[],
    tags?: GroupedEntity<DealroomCompanyTagEntity>[],
    fundingRounds?: GroupedEntity<DealroomFundingRoundEntity>[],
  ): CompanyDto[] {
    return entities.map((entity) =>
      this.map(
        entity,
        numberOfEmployees?.find((g) => g.id === entity.companyId),
        tags?.find((g) => g.id === entity.companyId),
        fundingRounds?.find((g) => g.id === entity.companyId),
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

  private parseJson<T>(text: string): T {
    if (!text) {
      return null;
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  }
}
