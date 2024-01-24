import { Injectable } from '@nestjs/common';

import { InvestorDto } from '@app/shared/data-warehouse';
import { InvestorDwhEntity } from '../entities/investor.dwh.entity';

@Injectable()
export class InvestorMapper {
  public mapMany(entities: InvestorDwhEntity[]): InvestorDto {
    return;
  }
}
