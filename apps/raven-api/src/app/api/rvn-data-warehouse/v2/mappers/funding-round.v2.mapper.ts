import {
  exposedFundingRoundData,
  FundingRoundDto,
} from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { MapperBase } from '../../interfaces/mapper.base';
import { DataWarehouseParser } from '../../utils/data-warehouse.parser';
import { FundingRoundV2DwhEntity } from '../entities/funding-round.v2.dwh.entity';

@Injectable()
export class FundingRoundV2Mapper extends MapperBase<
  FundingRoundV2DwhEntity,
  FundingRoundDto
> {
  public constructor() {
    super();
    this.exposedData = exposedFundingRoundData;
  }

  protected buildObject(entity: FundingRoundV2DwhEntity): FundingRoundDto {
    return {
      domain: entity.domain,
      date: entity.date,
      round: entity.round,
      currency: entity.currency,
      amount: entity.amount,
      amountInUsd: entity.amountInUsd,
      investors: DataWarehouseParser.parseSemicolonData(entity.investors),
    };
  }
}
