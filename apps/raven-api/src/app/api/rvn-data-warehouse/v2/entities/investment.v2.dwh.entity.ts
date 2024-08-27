import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DWH_V2_SCHEMA } from '../data-warehouse.v2.const';

@Entity({
  name: DWH_V2_SCHEMA.views.investments.name,
  schema: DWH_V2_SCHEMA.schemaName,
})
export class InvestmentV2DwhEntity {
  @PrimaryColumn({ name: 'fund_manager_name', type: 'varchar', length: 200 })
  public fundManagerName: string;

  @PrimaryColumn({ name: 'fund_manager_domain', type: 'nvarchar', length: 200 })
  public fundManagerDomain: string;

  @PrimaryColumn({ name: 'company_name', type: 'nvarchar', length: 200 })
  public companyName: string;

  @Column({ name: 'company_domain', type: 'nvarchar', length: 200 })
  public companyDomain: string;

  @Column({ name: 'is_direct_investment', type: 'smallint' })
  public isDirectInvestment: number;
}

// export const DWH_V2_INVESTORS_SELECT_COLUMNS: Partial<
//   keyof InvestmentV2DwhEntity
// >[] = ['domain', 'investorName', 'isPortfolio'];
