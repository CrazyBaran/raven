import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DWH_V2_SCHEMA } from '../data-warehouse.v2.const';

@Entity({
  name: DWH_V2_SCHEMA.views.investors.name,
  schema: DWH_V2_SCHEMA.schemaName,
})
export class InvestorV2DwhEntity {
  @PrimaryColumn({ name: 'investor_name', type: 'varchar', length: 200 })
  public investorName: string;

  @Column({ name: 'domain', type: 'nvarchar', length: 200 })
  public domain: string;

  @Column({ name: 'is_portfolio', type: 'smallint' })
  public isPortfolio: string;

  @Column({ name: 'logo_url', type: 'nvarchar', length: 1000 })
  public logoUrl: string;
}

export const DWH_V2_INVESTORS_SELECT_COLUMNS: Partial<
  keyof InvestorV2DwhEntity
>[] = ['domain', 'investorName', 'isPortfolio', 'logoUrl'];
