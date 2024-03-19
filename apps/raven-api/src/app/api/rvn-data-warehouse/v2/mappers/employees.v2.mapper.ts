import {
  exposedEmployeesData,
  NumberOfEmployeesSnapshotDto,
} from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { MapperBase } from '../../interfaces/mapper.base';
import { EmployeesV2DwhEntity } from '../entities/employees.v2.dwh.entity';

@Injectable()
export class EmployeesV2Mapper extends MapperBase<
  EmployeesV2DwhEntity,
  NumberOfEmployeesSnapshotDto
> {
  public constructor() {
    super();
    this.exposedData = exposedEmployeesData;
  }

  public mapMany(
    entities: EmployeesV2DwhEntity[],
  ): Partial<NumberOfEmployeesSnapshotDto>[] {
    const mappedEntities = super.mapMany(entities);
    return mappedEntities.sort((a, b) => {
      if (a.observationDate < b.observationDate) return -1;
      if (a.observationDate > b.observationDate) return 1;
      return 0;
    });
  }

  protected buildObject(
    entity: EmployeesV2DwhEntity,
  ): NumberOfEmployeesSnapshotDto {
    return {
      domain: entity.domain,
      observationDate: entity.observationDate,
      numberOfEmployees: entity.numberOfEmployees,
    };
  }
}
