import { Injectable } from '@nestjs/common';
import { RavenLogger } from '../../../rvn-logger/raven.logger';

import { NumberOfEmployeesSnapshotDto } from '@app/shared/data-warehouse';
import { DealroomCompanyNumberOfEmployeesEntity } from '../entities/dealroom-company-number-of-employees.entity';

@Injectable()
export class NumberOfEmployeesMapper {
  public constructor(private readonly logger: RavenLogger) {
    this.logger.setContext(NumberOfEmployeesMapper.name);
  }

  public mapMany(
    entities: DealroomCompanyNumberOfEmployeesEntity[],
  ): NumberOfEmployeesSnapshotDto[] {
    if (!entities) return null;
    return entities
      .map((entity) => this.map(entity))
      .sort((a, b) => {
        if (a.observationDate < b.observationDate) return -1;
        if (a.observationDate > b.observationDate) return 1;
        return 0;
      });
  }

  public map(
    entity: DealroomCompanyNumberOfEmployeesEntity,
  ): NumberOfEmployeesSnapshotDto {
    if (!entity) return null;
    return {
      observationDate: entity.observationDate,
      numberOfEmployees: entity.numberOfEmployees,
    };
  }
}
