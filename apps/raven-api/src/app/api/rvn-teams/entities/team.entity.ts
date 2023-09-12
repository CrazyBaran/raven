import {
  AfterInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ShareResource } from '../../rvn-acl/contracts/share-resource.interface';
import { ShareTeamEntity } from '../../rvn-acl/entities/share-team.entity';

@Entity({ name: 'teams' })
export class TeamEntity implements ShareResource {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public name: string;

  @Column({ nullable: true })
  public domain: string | null;

  @Column({ nullable: true })
  public samlIssuer: string | null;

  @Column({ length: 4000, nullable: true })
  public samlCert: string | null;

  @Column({ nullable: true })
  public samlEntryPoint: string | null;

  @Column({ default: true })
  public samlSignAssertions: boolean;

  @Column({ default: true })
  public samlSignAuthnResponse: boolean;

  @Column({ default: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress' })
  public samlIdentifierFormat: string;

  @OneToMany(() => ShareTeamEntity, (share) => share.resource)
  public shares: ShareTeamEntity[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  public members: ShareTeamEntity[];

  public idpManaged: boolean;

  @AfterInsert()
  @AfterLoad()
  public lifecycleUuidLowerCase(): void {
    this.id = this.id.toLowerCase();
    this.members = this.shares;
    this.idpManaged =
      !!this.domain &&
      !!this.samlIssuer &&
      !!this.samlCert &&
      !!this.samlEntryPoint;
  }
}
