import { Entity, PrimaryColumn } from 'typeorm';
import { DWH_V2_SCHEMA } from '../data-warehouse.v2.const';

@Entity({
  name: DWH_V2_SCHEMA.views.contacts.name,
  schema: DWH_V2_SCHEMA.schemaName,
})
export class ContactV2DwhEntity {
  @PrimaryColumn({ name: 'Domain', type: 'varchar', length: 200 })
  public domain: string;

  @PrimaryColumn({ name: 'Name', type: 'nvarchar', length: 200 })
  public name: string;

  @PrimaryColumn({ name: 'Email', type: 'nvarchar', length: 'MAX' })
  public email: string;

  @PrimaryColumn({ name: 'Positions', type: 'varchar', length: 'MAX' })
  public positions: string;
}

export const DWH_V2_CONTACT_SELECT_COLUMNS: Partial<
  keyof ContactV2DwhEntity
>[] = ['domain', 'name', 'email'];
