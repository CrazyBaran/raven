import { plainToInstance } from 'class-transformer';
import {
  AfterInsert,
  AfterLoad,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OrganisationEntity } from '../../rvn-opportunities/entities/organisation.entity';
import { ShortlistEntity } from './shortlist.entity';

@Entity('shortlist_organisation')
export class ShortlistOrganisationEntity {
  @PrimaryColumn({ name: 'shortlist_id' })
  public shortlistId: string;

  @PrimaryColumn({ name: 'organisation_id' })
  public organisationId: string;

  @ManyToOne(() => ShortlistEntity, (shortlist) => shortlist.organisations, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'shortlist_id', referencedColumnName: 'id' }])
  public shortlists: ShortlistEntity[];

  @ManyToOne(
    () => OrganisationEntity,
    (organisation) => organisation.shortlists,
    { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'organisation_id', referencedColumnName: 'id' }])
  public organisations: OrganisationEntity[];

  public static create(
    partial: Partial<ShortlistOrganisationEntity>,
  ): ShortlistOrganisationEntity {
    return plainToInstance(ShortlistOrganisationEntity, partial);
  }

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.organisationId = this.organisationId.toLowerCase();
    this.shortlistId = this.shortlistId.toLowerCase();
  }
}
