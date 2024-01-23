import { Entity, PrimaryColumn } from 'typeorm';
import { DWH_V1_SCHEMA } from '../data-warehouse.v1.const';

@Entity({
  name: DWH_V1_SCHEMA.views.companyTags.name,
  schema: DWH_V1_SCHEMA.schemaName,
})
export class DealroomCompanyTagEntity {
  @PrimaryColumn({ name: 'CompanyID' })
  public companyId: number;

  @PrimaryColumn({ name: 'Tag' })
  public tag: string;
}
