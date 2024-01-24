import { FundingRoundDto } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { DealroomFundingRoundEntity } from '../entities/dealroom-funding-rounds.dwh.entity';

@Injectable()
export class FundingRoundMapper {
  public mapMany(entities: DealroomFundingRoundEntity[]): FundingRoundDto[] {
    return entities.map((entity) => this.map(entity));
  }

  public map(entity: DealroomFundingRoundEntity): FundingRoundDto {
    return {
      fundingRoundId: entity.fundingRoundId,
      year: entity.year,
      month: entity.month,
      round: entity.round,
      amount: entity.amount,
      currency: entity.currency,
      dealRoomDataSource: entity.dealRoomDataSource,
      dealRoomSourceVerified: entity.dealRoomSourceVerified,
      lastRefreshedUTC: entity.lastRefreshedUTC,
    };
  }
}
