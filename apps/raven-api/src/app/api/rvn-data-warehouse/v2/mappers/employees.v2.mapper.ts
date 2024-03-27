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

  protected buildObject(
    entity: EmployeesV2DwhEntity,
  ): NumberOfEmployeesSnapshotDto {
    return {
      domain: entity.domain,
      observationDate: entity.observationDate,
      numberOfEmployees: entity.numberOfEmployees,
      dataSource: entity.dataSource,
    };
  }
}
