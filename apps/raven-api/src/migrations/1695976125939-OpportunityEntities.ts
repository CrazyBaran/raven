import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpportunityEntities1695976125939 implements MigrationInterface {
  public name = 'OpportunityEntities1695976125939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_organisations" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_0752f17d26b95923198296b8ffb" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_0752f17d26b95923198296b8ffb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0752f17d26b95923198296b8ff" ON "rvn_organisations" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_opportunities" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_6194e07c23b849fdaef2763ea3c" DEFAULT NEWSEQUENTIALID(), "organisation_id" int NOT NULL, "organisation_id_id" uniqueidentifier, CONSTRAINT "PK_6194e07c23b849fdaef2763ea3c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6194e07c23b849fdaef2763ea3" ON "rvn_opportunities" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_affinity_organisations" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_aef5ea4009042fc897576b01eed" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "internal_id" int NOT NULL, CONSTRAINT "PK_aef5ea4009042fc897576b01eed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_aef5ea4009042fc897576b01ee" ON "rvn_affinity_organisations" ("id") `,
    );
    await queryRunner.query(`ALTER TABLE "rvn_teams" DROP COLUMN "domain"`);
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" DROP COLUMN "saml_issuer"`,
    );
    await queryRunner.query(`ALTER TABLE "rvn_teams" DROP COLUMN "saml_cert"`);
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" DROP COLUMN "saml_entry_point"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" DROP CONSTRAINT "DF_3cc5c2be448344d969685905f1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" DROP COLUMN "saml_sign_assertions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" DROP CONSTRAINT "DF_c8bb9137ca0723c459be900c543"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" DROP COLUMN "saml_sign_authn_response"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" DROP CONSTRAINT "DF_378512aa10f5fa91d39052f2264"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" DROP COLUMN "saml_identifier_format"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD CONSTRAINT "FK_2dc949fe3efb4fb38fb721c191d" FOREIGN KEY ("organisation_id_id") REFERENCES "rvn_organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP CONSTRAINT "FK_2dc949fe3efb4fb38fb721c191d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" ADD "saml_identifier_format" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" ADD CONSTRAINT "DF_378512aa10f5fa91d39052f2264" DEFAULT 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress' FOR "saml_identifier_format"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" ADD "saml_sign_authn_response" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" ADD CONSTRAINT "DF_c8bb9137ca0723c459be900c543" DEFAULT 1 FOR "saml_sign_authn_response"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" ADD "saml_sign_assertions" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" ADD CONSTRAINT "DF_3cc5c2be448344d969685905f1d" DEFAULT 1 FOR "saml_sign_assertions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" ADD "saml_entry_point" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" ADD "saml_cert" nvarchar(4000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" ADD "saml_issuer" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_teams" ADD "domain" nvarchar(255)`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_aef5ea4009042fc897576b01ee" ON "rvn_affinity_organisations"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_affinity_organisations"`);
    await queryRunner.query(
      `DROP INDEX "IDX_6194e07c23b849fdaef2763ea3" ON "rvn_opportunities"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_opportunities"`);
    await queryRunner.query(
      `DROP INDEX "IDX_0752f17d26b95923198296b8ff" ON "rvn_organisations"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_organisations"`);
  }
}
