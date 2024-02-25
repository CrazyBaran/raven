import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dwh_v1_companies_investors')
@Index(['investorId'], { unique: true })
export class DataWarehouseCompaniesInvestorV1Entity {
  @PrimaryGeneratedColumn('uuid')
  public investorId: string;
  @Column()
  public name: string;
}
