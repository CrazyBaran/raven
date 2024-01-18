import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DealRoomCompanyTags', schema: 'Raven' })
export class DealroomCompanyTagEntity {
  @PrimaryColumn({ name: 'CompanyID' })
  public companyId: number;

  @Column({ name: 'Tag' })
  public tag: string;
}
