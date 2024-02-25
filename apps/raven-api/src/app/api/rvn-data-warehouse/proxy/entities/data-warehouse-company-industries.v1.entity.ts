import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dwh_v1_companies_industries')
@Index(['industryId'], { unique: true })
export class DataWarehouseCompaniesIndustryV1Entity {
  @PrimaryGeneratedColumn('uuid')
  public industryId: string;
  @Column()
  public name: string;
}
