import { Injectable } from '@nestjs/common';

import { InvestorDto } from '@app/shared/data-warehouse';
import { InvestorEntity } from '../entities/investor.entity';

@Injectable()
export class InvestorMapper {
  public mapMany(entities: InvestorEntity[]): InvestorDto {
    return;
  }
}
