import { plainToInstance } from 'class-transformer';
import {
  AfterInsert,
  AfterLoad,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OrganisationEntity } from '../../rvn-opportunities/entities/organisation.entity';
import { FundManagerEntity } from './fund-manager.entity';

@Entity('fund_manager_organisation')
export class FundManagerOrganisationEntity {
  @PrimaryColumn({ name: 'fund_manager_id' })
  @Index()
  public fundManagerId: string;

  @PrimaryColumn({ name: 'organisation_id' })
  @Index()
  public organisationId: string;

  @ManyToOne(() => FundManagerEntity, (manager) => manager.organisations, {
    cascade: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'fund_manager_id', referencedColumnName: 'id' }])
  public fundManagers: FundManagerEntity[];

  @ManyToOne(
    () => OrganisationEntity,
    (organisation) => organisation.fundManagers,
    { cascade: false, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'organisation_id', referencedColumnName: 'id' }])
  public organisations: OrganisationEntity[];

  public static create(
    partial: Partial<FundManagerOrganisationEntity>,
  ): FundManagerOrganisationEntity {
    return plainToInstance(FundManagerOrganisationEntity, partial);
  }

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.organisationId = this.organisationId?.toLowerCase();
    this.fundManagerId = this.fundManagerId?.toLowerCase();
  }
}
