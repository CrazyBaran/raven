import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DWH_V2_SCHEMA } from '../data-warehouse.v2.const';

@Entity({
  name: DWH_V2_SCHEMA.views.fundingRounds.name,
  schema: DWH_V2_SCHEMA.schemaName,
})
export class FundingRoundV2DwhEntity {
  @PrimaryColumn({ name: 'Domain', type: 'varchar', length: 300 })
  public domain: string;

  @PrimaryColumn({ name: 'Date', type: 'date' })
  public date: Date;

  @PrimaryColumn({ name: 'Round', type: 'varchar', length: 50 })
  public round: string;

  @PrimaryColumn({ name: 'Currency', type: 'varchar', length: 10 })
  public currency: string;

  @PrimaryColumn({ name: 'Amount', type: 'decimal', precision: 18 })
  public amount: number;

  @Column({ name: 'Investors', type: 'nvarchar', length: 'MAX' })
  public investors: string;

  @Column({ name: 'XRateFromUSD', type: 'decimal', precision: 18, scale: 2 })
  public xRateFromUSD: number;

  @Column({ name: 'AmountInUSD', type: 'decimal', precision: 18, scale: 2 })
  public amountInUsd: number;
}

export const DWH_V2_FUNDING_ROUND_SELECT_COLUMNS: Partial<
  keyof FundingRoundV2DwhEntity
>[] = [
  'domain',
  'date',
  'round',
  'currency',
  'amount',
  'investors',
  'amountInUsd',
];
