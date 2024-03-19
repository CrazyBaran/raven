import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DWH_V2_SCHEMA } from '../data-warehouse.v2.const';

@Entity({
  name: DWH_V2_SCHEMA.views.employees.name,
  schema: DWH_V2_SCHEMA.schemaName,
})
export class EmployeesV2DwhEntity {
  @PrimaryColumn({ name: 'Domain', type: 'varchar', length: 300 })
  public domain: string;

  @PrimaryColumn({ name: 'Observation Date', type: 'date' })
  public observationDate: Date;

  @Column({ name: 'Number of Employees', type: 'bigint' })
  public numberOfEmployees: number;
}

export const DWH_V2_EMPLOYEES_SELECT_COLUMNS: Partial<
  keyof EmployeesV2DwhEntity
>[] = ['domain', 'observationDate', 'numberOfEmployees'];
