import { CompanyDto, exposedCompanyData } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { DataWarehouseParser } from '../../utils/data-warehouse.parser';
import { CompanyV2DwhEntity } from '../entities/company.v2.dwh.entity';

@Injectable()
export class CompanyV2Mapper {
  public map(entity: CompanyV2DwhEntity): Partial<CompanyDto> {
    return pick(
      {
        domain: entity.domain,
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
      },
      exposedCompanyData,
    );
  }

  public mapMany(entities: CompanyV2DwhEntity[]): Partial<CompanyDto>[] {
    return entities.map((entity) => this.map(entity));
  }
}
