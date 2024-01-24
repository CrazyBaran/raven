import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DWH_V1_SCHEMA } from '../data-warehouse.v1.const';

@Entity({
  name: DWH_V1_SCHEMA.views.numberOfEmployees.name,
  schema: DWH_V1_SCHEMA.schemaName,
})
export class DealroomCompanyNumberOfEmployeesDwhEntity {
  @PrimaryColumn({ name: 'DealRoomCompanyID' })
  public companyId: number;

  @PrimaryColumn({ name: 'Observation Date' })
  public observationDate: Date;

  @Column({ name: 'Number of Employees' })
  public numberOfEmployees: number;
}
