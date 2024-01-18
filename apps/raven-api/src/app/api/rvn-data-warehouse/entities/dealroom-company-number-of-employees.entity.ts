import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DealRoomCompanyNumberOfEmployees', schema: 'Raven' })
export class DealroomCompanyNumberOfEmployeesEntity {
  @PrimaryColumn({ name: 'DealRoomCompanyID' })
  public companyId: number;

  @Column({ name: 'Observation Date' })
  public observationDate: Date;

  @Column({ name: 'Number of Employees' })
  public numberOfEmployees: number;
}
