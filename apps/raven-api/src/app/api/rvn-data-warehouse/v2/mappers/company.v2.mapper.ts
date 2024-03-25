import { CompanyDto, exposedCompanyData } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { DomainResolver } from '../../../rvn-utils/domain.resolver';
import { MapperBase } from '../../interfaces/mapper.base';
import { DataWarehouseParser } from '../../utils/data-warehouse.parser';
import { CompanyV2DwhEntity } from '../entities/company.v2.dwh.entity';

@Injectable()
export class CompanyV2Mapper extends MapperBase<
  CompanyV2DwhEntity,
  CompanyDto
> {
  public constructor(private readonly domainResolver: DomainResolver) {
    super();
    this.exposedData = exposedCompanyData;
  }

  protected buildObject(entity: CompanyV2DwhEntity): Partial<CompanyDto> {
    return {
      domain: this.domainResolver.cleanDomain(entity.domain),
      name: entity.name,
      description: entity.description,
      mcvLeadScore: entity.mcvLeadScore,
      industry: {
        industries: DataWarehouseParser.parseSemicolonData(entity.industries),
      },
      hq: {
        country: entity.country,
      },
      funding: {
        totalFundingAmount: entity.totalFundingAmount,
        lastFundingAmount: entity.lastFundingAmount,
        lastFundingDate: entity.lastFundingDate,
        lastFundingRound: entity.lastFundingRound,
      },
      actors: {
        investors: DataWarehouseParser.parseSemicolonData(entity.investors),
      },
      specterLastUpdated: entity.specterLastUpdated,
      dealRoomLastUpdated: entity.dealRoomLastUpdated,
      lastRefreshedUtc: entity.lastRefreshedUtc,
    };
  }
}
